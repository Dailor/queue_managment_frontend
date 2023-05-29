import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import TicketEvents from "@/services/events/TicketEvents"
import OperatorEvents from "@/services/events/OperatorEvents"

interface TicketSocketServiceArgs {
    setTicketInformation: Function
    setInFrontCount: Function
    setIsCalled: Function
    toggleIsSocketClosed: Function
}

class TicketSocketService extends BaseSocketService {
    setTicketInformation: Function
    setInFrontCount: Function
    setIsCalled: Function

    constructor({setTicketInformation, setInFrontCount, setIsCalled, toggleIsSocketClosed}: TicketSocketServiceArgs) {
        super({toggleIsSocketClosed})

        this.setTicketInformation = setTicketInformation
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
                    return this.setTicketInformation({ticket: payload.ticket, windowNumber: payload.windowNumber})
                case TicketEvents.POSITION_LOAD:
                    return this.setInFrontCount(payload.position - 1)
                case OperatorEvents.CALL_NEXT:
                    return this.setIsCalled({'windowNumber': payload.windowNumber})
                default:
                    break
            }
        }
        this.socket.onclose = () => {

        }
    }
}

export default TicketSocketService