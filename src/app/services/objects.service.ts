import {Injectable} from '@angular/core'
import {Observable, map} from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { IObject } from '../models/IObject';

@Injectable({
    providedIn: 'root'
})

export class ObjectsService {
    constructor(private http: HttpClient){

    }
    getObjects(token: string, organizationGUID: string): Observable<IObject[]> {
        let getObjectsUrl = "https://rentobjects.onrender.com/organizations/" + organizationGUID + "/objects";
        const headers = { 'Authorization': 'Bearer ' + token }
        return this.http.get<IObject[]>(getObjectsUrl, { headers }).pipe(map((data:any)=>{
            return data
        }))
    }

    addObject(token: string, organizationGUID: string, parentObjectID:string, name:string): Observable<IObject[]> {
        let addObjectUrl = "https://rentobjects.onrender.com/organizations/" + organizationGUID + "/objects";
        const headers = { 'Authorization': 'Bearer ' + token }
        let body = {}
        if(parentObjectID !== "")
            body = {name: name, parentObjectID: parentObjectID};
        else 
            body = {name: name};
        return this.http.post<any>(addObjectUrl, body, { headers, observe: 'response' }).pipe(map((data:any)=>{
            return data
        }))
    }
    deleteObject(token: string, organizationGUID: string, objectID: string) {
        let deleteObjectUrl = "https://rentobjects.onrender.com/organizations/" + organizationGUID + "/objects/" + objectID;
        const headers = { 'Authorization': 'Bearer ' + token };
        return this.http.delete(deleteObjectUrl, { headers, observe: 'response' }).pipe(map((data:any)=>{
            return data
        }))
    }
}