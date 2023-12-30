import { browser } from '$app/environment'

export function isMac () {
    if (!browser) return false
    return window.navigator.userAgent.toLowerCase().indexOf('mac') > -1
}

export function holdingCtrlOrCmd (e) {
    return isMac() ? e.metaKey : e.ctrlKey
}