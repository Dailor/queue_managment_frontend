type BaseSocketServiceArgs = {
    toggleIsSocketClosed: Function
}

class BaseSocketService {
    socket: null | WebSocket
    toggleIsSocketClosed: Function

    constructor({toggleIsSocketClosed}: BaseSocketServiceArgs) {
        this.socket = null
        this.toggleIsSocketClosed = toggleIsSocketClosed
    }

    parse(obj: string) {
        return JSON.parse(obj)
    }

    sendObject(obj: object) {
        this.socket?.send(JSON.stringify(obj))
    }

    onSocketClose() {
        this.toggleIsSocketClosed(true)
    }
}

export default BaseSocketService