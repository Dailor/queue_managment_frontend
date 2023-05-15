export interface ILoginResponse {
    accessToken: string
    refreshToken: string
}

export interface IRefreshResponse extends ILoginResponse {}