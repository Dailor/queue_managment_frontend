import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import OperatorEvents from "@/services/events/OperatorEvents"
import BasicQueueEvents from "@/services/events/BasicQueueEvents"

interface OperatorSocketServiceArgs {
    setCountInQueue: Function
    setCurrentNumber: Function
    toggleIsSocketClosed: Function
}
class OperatorSocketService extends BaseSocketService {
    setCountInQueue: Function
    setCurrentNumber: Function

    constructor({setCountInQueue, setCurrentNumber, toggleIsSocketClosed}: OperatorSocketServiceArgs) {
        super({toggleIsSocketClosed})

        this.setCountInQueue = setCountInQueue
        this.setCurrentNumber = setCurrentNumber
    }

    init(token: string) {
        this.socket = new WebSocket(webSocketEndpoints.operator() + `?token=${token}`)

        this.socket.onopen = () => {
            this.sendObject(
                {type: BasicQueueEvents.UPDATE_IN_QUEUE_COUNT}
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
                case BasicQueueEvents.UPDATE_IN_QUEUE_COUNT:
                    return this.setCountInQueue(payload.count)
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