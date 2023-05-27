import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import TicketEvents from "@/services/events/TicketEvents"
import OperatorEvents from "@/services/events/OperatorEvents"


class TicketSocketService extends BaseSocketService {
    setTicketFull: Function
    setInFrontCount: Function
    setIsCalled: Function

    constructor({setTicketFull, setInFrontCount, setIsCalled, toggleIsSocketClosed}) {
        super({toggleIsSocketClosed})

        this.setTicketFull = setTicketFull
        this.setInFrontCount = setInFrontCount
        this.setIsCalled = setIsCalled
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
                case OperatorEvents.CALL_NEXT:
                    return this.setIsCalled({'windowNumber': payload.payload.windowNumber})
                default:
                    break
            }
        }
        this.socket.onclose = () => {

        }
    }
}

export default TicketSocketService