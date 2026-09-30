/**
 * 本机设置：只作用于当前这台收银机，保存在 localStorage
 */
const PREFIX = 'cashier:'

// 默认值
const DEFAULTS = {
    // 收银机名称（小票、订单备注区分机器用）
    machineName: '',
    // 默认支付方式
    defaultPayType: 'MICROPAY',
    // 商品展示模式
    goodsMode: 'small',
    // 扫码枪结束符：13=回车、9=Tab、10=换行
    scannerEndKey: '13',
    // 扫码枪字符间隔阈值（毫秒），超过判定为新的一次扫码
    scannerGapMs: 30,
    // 扫码枪前缀剔除（部分扫码枪会带 ]C1 之类前缀）
    scannerStripPrefix: '',
    // 无操作自动锁屏时间（分钟），0 表示不锁屏
    autoLockMinutes: 0,
    // 打印方式：dialog=系统弹窗、silent=静默打印
    printMode: 'dialog',
    // 静默打印使用的打印机名称
    printerName: '',
    // 纸张宽度（mm）
    paperWidth: 58,
    // 打印份数
    printCopies: 1,
    // 支付成功后自动打印小票：Y/N
    autoPrintAfterPay: 'N'
}

function parseItem(key, value) {
    const def = DEFAULTS[key]
    if (value === null || value === undefined || value === '') {
        return def
    }
    if (typeof def === 'number') {
        const num = parseInt(value)
        return isNaN(num) ? def : num
    }
    return value
}

/**
 * 读取单个设置项
 */
export function getSetting(key) {
    const value = localStorage.getItem(PREFIX + key)
    return parseItem(key, value)
}

/**
 * 写入单个设置项
 */
export function setSetting(key, value) {
    localStorage.setItem(PREFIX + key, value)
    return value
}

/**
 * 读取全部设置项（带默认值）
 */
export function getAllSettings() {
    const result = {}
    Object.keys(DEFAULTS).forEach(key => {
        result[key] = getSetting(key)
    })
    // 商品展示模式沿用收银台原有 key，保证两处一致
    const goodsMode = localStorage.getItem('goodsMode')
    if (goodsMode) {
        result.goodsMode = goodsMode
    }
    return result
}

/**
 * 批量保存设置项
 */
export function saveAllSettings(data) {
    const config = data || {}
    Object.keys(config).forEach(key => {
        if (DEFAULTS[key] !== undefined) {
            setSetting(key, config[key])
        }
    })
    // 商品展示模式同步到收银台原有 key
    if (config.goodsMode) {
        localStorage.setItem('goodsMode', config.goodsMode)
    }
    return getAllSettings()
}

/**
 * 恢复默认设置（保留门店、账号等云端数据）
 */
export function resetSettings() {
    Object.keys(DEFAULTS).forEach(key => {
        localStorage.removeItem(PREFIX + key)
    })
    return getAllSettings()
}

/**
 * 清除本机设置以外的缓存数据（登录信息保留）
 */
export function clearCache() {
    const keep = ['Access-Token', 'User-Id', 'name', 'roles', 'permissions']
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && keep.indexOf(key) < 0 && key.indexOf(PREFIX) < 0) {
            keys.push(key)
        }
    }
    keys.forEach(key => localStorage.removeItem(key))
    return keys.length
}

export function getDefaults() {
    return Object.assign({}, DEFAULTS)
}
