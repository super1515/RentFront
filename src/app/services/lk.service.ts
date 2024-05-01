import {Injectable} from '@angular/core'
import {Observable, throwError} from 'rxjs'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { IRegister } from '../models/IRegister'
import { map, catchError} from "rxjs/operators";
import { ILoginResponse } from '../models/ILoginResponse'
import { ILogin } from '../models/ILogin'
import { IOrganization } from '../models/IOrganization';

@Injectable({
    providedIn: 'root'
})

export class LkService {
    constructor(private http: HttpClient){

    }
    getOrganizationsUrl = "https://rentlk.onrender.com/organizations";
    addOrganizationUrl = "https://rentlk.onrender.com/organizations";
    deleteOrganizationUrl = "https://rentlk.onrender.com/organizations";
    getOrganizations(token: string): Observable<IOrganization[]> {
        const headers = { 'Authorization': 'Bearer ' + token }
        return this.http.get<IOrganization[]>(this.getOrganizationsUrl, { headers }).pipe(map((data:any)=>{
            return data
        }))
    }
    addOrganization(token: string, name: string) {
        const headers = { 'Authorization': 'Bearer ' + token };
        const body = {name: name};
        return this.http.post(this.addOrganizationUrl, body, { headers, observe: 'response' }).pipe(
            catchError(err => {return [err]})
          );
    }
    deleteOrganization(token: string, guid: string) {
        const headers = { 'Authorization': 'Bearer ' + token };
        return this.http.delete(this.deleteOrganizationUrl + '/' + guid, { headers, observe: 'response' }).pipe(
            catchError(err => {return [err]})
          );
    }
}