class BaseSocketService {
    socket: WebSocket

    sendObject(obj) {
        this.socket.send(JSON.stringify(obj))
    }

    parse(obj) {
        return JSON.parse(obj)
    }
}

export default BaseSocketService