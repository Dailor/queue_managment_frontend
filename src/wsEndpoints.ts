const getWebSocketProtocol = () => {
    return location.protocol.includes('https') ? 'wss://' : 'ws://'
}

const getWebSocketUrl = (path) => {
    return getWebSocketProtocol() + location.host + path
}

const webSocketEndpoints = {
    dashboard: getWebSocketUrl('/dashboard'),
    client: getWebSocketUrl('/client')
}

export default webSocketEndpoints