import {Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core'
import { ILogin } from '../../models/ILogin'
import { IRegister } from '../../models/IRegister'
import {IRegisterResponse} from '../../models/IRegisterResponse'
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ILoginResponse } from '../../models/ILoginResponse';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLogin = false;
    isWaiting = false;
    infoMessages: string[] = [];
    register: IRegister = {
        name: "",
        surname: "",
        mail: "",
        password: "",
        passwordConfirm: ""
    }
    login: ILogin = {
        mail: "",
        password: ""
    }
    constructor(private authService: AuthService){

    }

    loginUser(){
        console.log(this.login)
        this.isWaiting = true;
        this.authService.loginUser(this.login).subscribe({
            next:(data: ILoginResponse) => { 
                this.isWaiting = false;
                if(data.access_token){
                    this.infoMessages.push("Вход выполнен успешно")
                    window.localStorage.setItem("token", data.access_token);
                    window.location.reload();
                }else{
                console.log(data.error_description)
                this.infoMessages.push(data.error_description);
                }
            }
        })
    }
    registerUser(){
        this.isWaiting = true;
        this.authService.registerUser(this.register).subscribe({
            next:(data: IRegisterResponse) => { 
                this.isWaiting = false;
                if(data.isSuccessfulRegistration){
                    this.infoMessages.push("Пользователь зарегистрирован")
                    window.localStorage.setItem("registered", "123");
                }else{
                console.log(data.errors)
                if (Array.isArray(data.errors)) {
                    this.infoMessages = data.errors;
                  } else {
                    this.infoMessages = this.extractStrings(data.errors);
                    console.log(this.infoMessages);
                  }
                }
            }
        })
    }
    extractStrings(data: any): string[] {
        let strings: string[] = [];
        
        if (typeof data === 'string') {
          strings.push(data);
        } else if (Array.isArray(data)) {
          data.forEach((item) => {
            strings = strings.concat(this.extractStrings(item));
          });
        } else if (typeof data === 'object') {
          Object.values(data).forEach((value) => {
            strings = strings.concat(this.extractStrings(value));
          });
        }
        
        return strings;
      }
}