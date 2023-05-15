export function getUrlQueryByParams(params) {
    return '?' + new URLSearchParams(params).toString()
}

export function getUrlByPathAndParams(path, params) {
    return path + getUrlQueryByParams(params)
}