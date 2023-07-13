import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import OperatorEvents from "@/services/events/OperatorEvents"
import DashboardEvents from "@/services/events/DashboardEvents"
import BasicQueueEvents from "@/services/events/BasicQueueEvents"

interface DashboardSocketServiceArgs {
    toggleIsSocketClosed: Function
    addNewOnDashboard: Function
    setInQueueCount: Function
    loadListOnDashboard: Function
}

class DashboardSocketService extends BaseSocketService {
    addNewOnDashboard: Function
    setInQueueCount: Function
    loadListOnDashboard: Function

    constructor({addNewOnDashboard, setInQueueCount, toggleIsSocketClosed, loadListOnDashboard}: DashboardSocketServiceArgs) {
        super({toggleIsSocketClosed})
        this.addNewOnDashboard = addNewOnDashboard
        this.setInQueueCount = setInQueueCount
        this.loadListOnDashboard = loadListOnDashboard
    }

    init(token: string) {
        this.socket = new WebSocket(webSocketEndpoints.dashboard() + `?token=${token}`)

        this.socket.onopen = () => {
            this.sendObject({
                type: DashboardEvents.BASIC_LOAD
            })
        }

        this.socket.onclose = (event) => {
            this.onSocketClose()
        }

        this.socket.onmessage = (event) => {
            const data = this.parse(event.data)

            const eventType = data.type
            const payload = data.payload

            switch (eventType) {
                case DashboardEvents.BASIC_LOAD:
                    return this.loadListOnDashboard(payload.windows_to_ticket_numbers)
                case BasicQueueEvents.UPDATE_IN_QUEUE_COUNT:
                    return this.setInQueueCount(payload.count)
                case OperatorEvents.CALL_NEXT:
                    return this.addNewOnDashboard(payload.window, payload.ticket)
                default:
                    break
            }
        }
    }
}

export default DashboardSocketService