type Params = Record<string, string>


export function getUrlQueryByParams(params: Params) {
    return '?' + new URLSearchParams(params).toString()
}

export function getUrlByPathAndParams(path: string, params: Params) {
    return path + getUrlQueryByParams(params)
}