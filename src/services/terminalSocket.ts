import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import TerminalEvents from "@/services/events/TerminalEvents"


class TerminalSocketService extends BaseSocketService {
    setTicketQr: Function
    switchOnLoader: Function

    constructor({setTicketQr, switchOnLoader}) {
        super()
        this.setTicketQr = setTicketQr
        this.switchOnLoader = switchOnLoader
    }

    init(token) {
        this.socket = new WebSocket(webSocketEndpoints.terminal() + `?token=${token}`)

        this.socket.onopen = () => {
            this.sendObject(
                {type: TerminalEvents.QR_LOAD}
            )
        }

        this.socket.onclose = (event) => {
            console.log(event)
        }

        this.socket.onmessage = (event) => {
            const data = this.parse(event.data)

            const eventType = data.type
            const payload = data.payload

            console.log(data)

            switch (eventType) {
                case TerminalEvents.QR_LOAD:
                    this.setTicketQr(payload.ticket)
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