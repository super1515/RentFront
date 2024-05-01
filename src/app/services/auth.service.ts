import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {IRegisterResponse} from '../models/IRegisterResponse'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { IRegister } from '../models/IRegister'
import { map, catchError} from "rxjs/operators";
import { ILoginResponse } from '../models/ILoginResponse'
import { ILogin } from '../models/ILogin'

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(private http: HttpClient){

    }
    registerUrl = "https://rentauth.onrender.com/accounts/registration";
    loginUrl = "https://rentauth.onrender.com/connect/token";
    registerUser(registerData: IRegister): Observable<IRegisterResponse> {
        console.log(registerData)
        const body = {firstname: registerData.name,
            lastname: registerData.surname,
            email: registerData.mail,
            password: registerData.password,
            confirmPassword: registerData.passwordConfirm};
        return this.http.post<IRegisterResponse>(this.registerUrl, body).pipe(map((data:any)=>{
            var success: IRegisterResponse = {
                isSuccessfulRegistration: true,
                errors: []
            }
            return success
        }),
        catchError(err => {  
            var success: IRegisterResponse = {
                isSuccessfulRegistration: err.error.isSuccessfulRegistration,
                errors: err.error.errors
            }
            return [success]
        }))
    }

    loginUser(loginData: ILogin): Observable<ILoginResponse> {
        console.log(loginData)
        const body = new HttpParams()
        .set('grant_type', 'password')
        .set('scope', 'lk clients contracts objects')
        .set('client_id', 'RentApi')
        .set('username', loginData.mail)
        .set('password', loginData.password);
        return this.http.post<ILoginResponse>(this.loginUrl, body,
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
            }).pipe(map((data:any)=>{
            return data
        }),
        catchError(err => {  
            var success: ILoginResponse = err.error
            return [success]
        }))
    }
}