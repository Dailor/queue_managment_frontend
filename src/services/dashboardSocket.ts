import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import OperatorEvents from "@/services/events/OperatorEvents";
import DashboardEvents from "@/services/events/DashboardEvents";

interface DashboardSocketServiceArgs {
    toggleIsSocketClosed: Function
    addNewOnDashboard: Function
    setInQueueCount: Function
}

class DashboardSocketService extends BaseSocketService {
    addNewOnDashboard: Function
    setInQueueCount: Function

    constructor({addNewOnDashboard, setInQueueCount, toggleIsSocketClosed}: DashboardSocketServiceArgs) {
        super({toggleIsSocketClosed})
        this.addNewOnDashboard = addNewOnDashboard
        this.setInQueueCount = setInQueueCount
    }

    init(token: string) {
        this.socket = new WebSocket(webSocketEndpoints.dashboard() + `?token=${token}`)

        this.socket.onopen = () => {
            this.sendObject({
                type: DashboardEvents.BASIC_LOAD
            })
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
                case OperatorEvents.CALL_NEXT:
                    return this.addNewOnDashboard(payload.window, payload.ticket)
                case OperatorEvents.UPDATE_IN_QUEUE_COUNT:
                    return this.setInQueueCount(payload.count)
                default:
                    break
            }
        }
    }
}

export default DashboardSocketService