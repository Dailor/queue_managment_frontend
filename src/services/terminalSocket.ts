import webSocketEndpoints from "@/wsEndpoints"

class TerminalSocketService {
    socket: WebSocket

    constructor() {

    }

    init(token) {
        this.socket = new WebSocket(webSocketEndpoints.terminal() + `?token=${token}`)

        this.socket.onopen = function () {
        }

        this.socket.onclose = function () {
        }

        this.socket.onmessage = function (event) {
            alert(`[message] Данные получены с сервера: ${event.data}`)
        }
    }
}

export default TerminalSocketService