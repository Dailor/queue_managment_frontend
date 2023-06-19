import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import TerminalEvents from "@/services/events/TerminalEvents"

interface TerminalSocketServiceArgs {
    setQr: Function
    switchOnLoader: Function
    toggleIsSocketClosed: Function
}

class TerminalSocketService extends BaseSocketService {
    setQr: Function
    switchOnLoader: Function

    constructor({setQr, switchOnLoader, toggleIsSocketClosed}: TerminalSocketServiceArgs) {
        super({toggleIsSocketClosed})
        this.setQr = setQr
        this.switchOnLoader = switchOnLoader
    }

    init(token: string) {
        this.socket = new WebSocket(webSocketEndpoints.terminal() + `?token=${token}`)

        this.socket.onopen = () => {
            this.sendObject(
                {type: TerminalEvents.QR_REFRESH}
            )
        }

        this.socket.onclose = () => this.onSocketClose()

        this.socket.onmessage = (event) => {
            const data = this.parse(event.data)

            const eventType = data.type
            const payload = data.payload

            console.log(data)

            switch (eventType) {
                case TerminalEvents.QR_REFRESH:
                    this.setQr(payload.qr)
                    break
                case TerminalEvents.SET_LOADER:
                    this.switchOnLoader()
                    break
                default:
                    break
            }
        }
    }

}

export default TerminalSocketService