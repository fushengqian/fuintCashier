import { BrowserWindow } from 'electron'
import fs from 'fs'
import os from 'os'
import path from 'path'

// 小票打印临时目录
const TMP_DIR = path.join(os.tmpdir(), 'fuint-print')

function ensureDir() {
    if (!fs.existsSync(TMP_DIR)) {
        fs.mkdirSync(TMP_DIR, { recursive: true })
    }
}

/**
 * 获取系统打印机列表
 * @param win 主窗口（用于取 webContents）
 * @returns {Array} [{ name, displayName, isDefault, status }]
 */
export function getPrinterList(win) {
    try {
        const list = win && win.webContents ? win.webContents.getPrinters() : []
        return list.map(item => {
            return {
                name: item.name,
                displayName: item.displayName ? item.displayName : item.name,
                isDefault: item.isDefault === true,
                status: item.status
            }
        })
    } catch (e) {
        return []
    }
}

/**
 * 静默打印小票：用隐藏窗口加载 HTML 后直接输出到指定打印机
 * @param html 小票内容（含样式）
 * @param options { deviceName, copies }
 * @returns Promise<{success, message}>
 */
export function printHtml(html, options) {
    const config = options || {}
    return new Promise((resolve, reject) => {
        ensureDir()
        const file = path.join(TMP_DIR, `receipt-${Date.now()}.html`)
        fs.writeFileSync(file, html, 'utf8')

        const win = new BrowserWindow({
            show: false,
            width: 320,
            height: 600,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: false
            }
        })

        let finished = false
        const cleanUp = () => {
            try { fs.unlinkSync(file) } catch (e) { /* empty */ }
            if (!win.isDestroyed()) { win.destroy() }
        }
        // 超时兜底，避免打印回调不触发导致窗口泄漏
        const timer = setTimeout(() => {
            if (!finished) {
                finished = true
                cleanUp()
                resolve({ success: true, message: '打印指令已发送' })
            }
        }, 15000)

        win.loadFile(file)
        win.webContents.once('did-finish-load', () => {
            const printOptions = {
                silent: true,
                printBackground: true,
                copies: config.copies ? parseInt(config.copies) : 1,
                margins: { marginType: 'none' }
            }
            if (config.deviceName) {
                printOptions.deviceName = config.deviceName
            }
            win.webContents.print(printOptions, (success, reason) => {
                if (finished) { return }
                finished = true
                clearTimeout(timer)
                cleanUp()
                if (success) {
                    resolve({ success: true })
                } else {
                    reject(new Error(reason ? reason : '打印失败'))
                }
            })
        })
    })
}
