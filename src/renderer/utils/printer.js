import { ipcRenderer } from 'electron'

/**
 * 是否运行在 Electron 客户端中（Web 版收银台不具备打印相关能力）
 */
export function isElectron() {
    try {
        return typeof ipcRenderer !== 'undefined' && !!ipcRenderer.invoke
    } catch (e) {
        return false
    }
}

/**
 * 获取系统打印机列表
 */
export function getPrinterList() {
    if (!isElectron()) {
        return Promise.resolve([])
    }
    return ipcRenderer.invoke('printer-list').then(list => {
        return list ? list : []
    }).catch(() => {
        return []
    })
}

/**
 * 根据小票 DOM 构建完整 HTML（纸张宽度由 @page 控制）
 * @param el 小票容器 DOM
 * @param widthMm 纸张宽度（58 / 80）
 */
export function buildPrintHtml(el, widthMm) {
    const content = el ? el.outerHTML : ''
    const width = widthMm ? widthMm : 58
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>receipt</title><style>' +
        '@page { size: ' + width + 'mm auto; margin: 0mm; }' +
        'html, body { margin: 0px; padding: 0px; width: ' + width + 'mm; background: #ffffff; color: #000000; font-family: "Microsoft YaHei", Arial, sans-serif; font-size: 12px; }' +
        'div { clear: both; }' +
        '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
        '</style></head><body>' + content + '</body></html>'
    return html
}

/**
 * 静默打印小票
 * @param params { html, deviceName, copies }
 */
export function silentPrint(params) {
    if (!isElectron()) {
        return Promise.resolve({ success: false, message: '当前环境不支持静默打印' })
    }
    const config = params || {}
    return ipcRenderer.invoke('print-silent', {
        html: config.html,
        deviceName: config.deviceName,
        copies: config.copies ? config.copies : 1
    })
}

/**
 * 获取客户端版本号
 */
export function getAppVersion() {
    if (!isElectron()) {
        return Promise.resolve('')
    }
    return ipcRenderer.invoke('get-app-version').catch(() => '')
}

/**
 * 触发检查更新（更新进度由主进程通过 update-msg 事件推送）
 */
export function checkUpdate() {
    if (!isElectron()) {
        return Promise.resolve(false)
    }
    return ipcRenderer.invoke('check-update').then(() => true).catch(() => false)
}

/**
 * 重启客户端
 */
export function restartApp() {
    if (!isElectron()) {
        return Promise.resolve(false)
    }
    return ipcRenderer.invoke('restart-app').catch(() => false)
}
