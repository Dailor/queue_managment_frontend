import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"

interface DashboardSocketServiceArgs {
    toggleIsSocketClosed: Function
}
class DashboardSocketService extends BaseSocketService {

    constructor({toggleIsSocketClosed}: DashboardSocketServiceArgs) {
        super({toggleIsSocketClosed})
    }

    init(token: string) {
        this.socket = new WebSocket(webSocketEndpoints.dashboard() + `?token=${token}`)

        this.socket.onopen = () => {
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
                default:
                    break
            }
        }
    }
}

export default DashboardSocketService