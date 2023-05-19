import {getUrlByPathAndParams} from "@/utilities/uri"

export class BaseEndpointAPI {
    static preBase = '/api'
    static base

    protected static getEndpoint(path) {
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

    static edit = (id) => {
        return this.getEndpoint(`/${id}`)
    }
}

export class UsersEndpointsAPI extends CRUDEndpointsAPI {
    static base = '/v1/users'
}

export class OperatorEndpointsAPI extends BaseEndpointAPI {
    static base = '/v1/operator'
}

export class DashboardEndpointsAPI extends BaseEndpointAPI {
    static base = '/v1/dashboard'
}