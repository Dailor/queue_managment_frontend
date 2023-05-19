const getWebSocketProtocol = () => {
    return location.protocol.includes('https') ? 'wss://' : 'ws://'
}

const getWebSocketUrl = (path) => {
    return getWebSocketProtocol() + location.host + path + '/ws'
}

const webSocketEndpoints = {
    dashboard: getWebSocketUrl('/dashboard'),
    terminal: getWebSocketUrl('/terminal'),
    client: getWebSocketUrl('/client')
}

export default webSocketEndpoints