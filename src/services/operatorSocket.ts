import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import OperatorEvents from "@/services/events/OperatorEvents"
import BasicQueueEvents from "@/services/events/BasicQueueEvents"

interface OperatorSocketServiceArgs {
    setQueues: Function
    setCurrentNumber: Function
    toggleIsSocketClosed: Function
}
class OperatorSocketService extends BaseSocketService {
    setQueues: Function
    setCurrentNumber: Function

    constructor({setQueues, setCurrentNumber, toggleIsSocketClosed}: OperatorSocketServiceArgs) {
        super({toggleIsSocketClosed})

        this.setQueues = setQueues
        this.setCurrentNumber = setCurrentNumber
    }

    init(token: string) {
        this.socket = new WebSocket(webSocketEndpoints.operator() + `?token=${token}`)

        this.socket.onopen = () => {
            this.sendObject(
                {type: BasicQueueEvents.BASIC_QUEUES_INFO}
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
                case BasicQueueEvents.BASIC_QUEUES_INFO:
                    return this.setQueues(payload.queues)
                case OperatorEvents.SET_CURRENT:
                    return this.setCurrentNumber(payload.ticket.number)
                default:
                    break
            }
        }
    }

    callNext(){
        this.sendObject({
            type: OperatorEvents.CALL_NEXT
        })
    }
}

export default OperatorSocketService