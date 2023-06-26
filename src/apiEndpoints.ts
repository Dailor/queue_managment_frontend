export class BaseEndpointAPI {
    static preBase = '/api'
    static base: string

    protected static getEndpoint(path: string) {
        return this.preBase + this.base + path
    }
}

export class AuthEndpointAPI extends BaseEndpointAPI {
    static base = '/v1/auth'

    static login = this.getEndpoint('/login')
    static refresh = this.getEndpoint('/refresh')
    static logout = this.getEndpoint('/logout')

    static me = this.getEndpoint('/me')
}

class CRUDEndpointsAPI extends BaseEndpointAPI {
    static get list() {
        return this.getEndpoint('/')
    }

    static edit = (id: string | number) => {
        return this.getEndpoint(`/${id}`)
    }
}

export class UsersEndpointsAPI extends CRUDEndpointsAPI {
    static base = '/users'
}

export class OperatorEndpointsAPI extends BaseEndpointAPI {
    static base = '/operator'
}

export class DashboardEndpointsAPI extends BaseEndpointAPI {
    static base = '/dashboard'
}

export class TicketEndpointsAPI extends BaseEndpointAPI {
    static base = '/ticket'

    static scan = this.getEndpoint('/scanner')

    static book = this.getEndpoint('/book')
}

export class QueueEndpointAPI extends CRUDEndpointsAPI {
    static base = '/v1/queue'
}