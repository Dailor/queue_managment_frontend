import {getHost} from "@/constants"

const getWebSocketProtocol = () => {
    return location.protocol.includes('https') ? 'wss://' : 'ws://'
}

const getWebSocketUrl = (path: string) => {
    const host = getHost()

    return getWebSocketProtocol() + host + '/api' + path + '/ws'
}

const webSocketEndpoints = {
    dashboard: () => getWebSocketUrl('/dashboard'),
    terminal: () => getWebSocketUrl('/terminal'),
    ticket: () => getWebSocketUrl('/ticket'),
    operator: () => getWebSocketUrl('/operator')
}

export default webSocketEndpoints