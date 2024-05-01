export interface ILoginResponse {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
    error: string
    error_description: string
}