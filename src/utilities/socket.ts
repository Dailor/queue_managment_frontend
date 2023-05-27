class BaseSocketService {
    socket: WebSocket
    toggleIsSocketClosed: Function

    constructor({toggleIsSocketClosed}) {
        this.toggleIsSocketClosed = toggleIsSocketClosed
    }

    parse(obj) {
        return JSON.parse(obj)
    }

    sendObject(obj) {
        this.socket.send(JSON.stringify(obj))
    }

    onSocketClose() {
        this.toggleIsSocketClosed(true)
    }
}

export default BaseSocketService