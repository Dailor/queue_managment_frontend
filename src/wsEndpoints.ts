const getWebSocketProtocol = () => {
    return location.protocol.includes('https') ? 'wss://' : 'ws://'
}

const getWebSocketUrl = (path) => {
    let host

    if (process.env.DEBUG) {
        host = 'localhost:8000'
    } else {
        host = location.host
    }

    return getWebSocketProtocol() + host + path + '/ws'
}

const webSocketEndpoints = {
    dashboard: () => getWebSocketUrl('/dashboard'),
    terminal: () => getWebSocketUrl('/terminal'),
    ticket: () => getWebSocketUrl('/ticket'),
    operator: () => getWebSocketUrl('/operator')
}

export default webSocketEndpoints