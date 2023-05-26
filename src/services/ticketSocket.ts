import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import TerminalEvents from "@/services/events/TerminalEvents"
import TicketEvents from "@/services/events/TicketEvents"


class TicketSocketService extends BaseSocketService {
    setTicketFull: Function
    setInFrontCount: Function

    constructor({setTicketFull, setInFrontCount}) {
        super()

        this.setTicketFull = setTicketFull
        this.setInFrontCount = setInFrontCount
    }

    init(ticketHash: string) {
        this.socket = new WebSocket(webSocketEndpoints.ticket() + `?ticket_hash=${ticketHash}`)

        this.socket.onopen = () => {
            this.sendObject({
                type: TicketEvents.TICKET_LOAD
            })
        }

        this.socket.onmessage = (event) => {
            const data = this.parse(event.data)

            const eventType = data.type
            const payload = data.payload

            switch (eventType) {
                case TicketEvents.TICKET_LOAD:
                    return this.setTicketFull(payload.ticket)
                case TicketEvents.POSITION_LOAD:
                    return this.setInFrontCount(payload.position - 1)
                default:
                    break
            }
        }
        this.socket.onclose = () => {

        }
    }
}

export default TicketSocketService