import {Injectable} from '@angular/core'
import {Observable, map} from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { ICustomParams, IObject, IPolygon } from '../models/IObject';

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
    addCustomParams(token: string, organizationGUID: string, objectID:string, customParams:ICustomParams[]){
        let addCustomParamsUrl = "https://rentobjects.onrender.com/organizations/" + organizationGUID + "/objects/" + objectID + "/customparams";
        const headers = { 'Authorization': 'Bearer ' + token }
        let body = customParams
        return this.http.post<any>(addCustomParamsUrl, body, { headers, observe: 'response' }).pipe(map((data:any)=>{
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

    addPlan(token: string, organizationGUID: string, objectID:string, file:FormData): Observable<IObject[]> {
        let addPlanUrl = "https://rentobjects.onrender.com/organizations/" + organizationGUID + "/objects/" + objectID + "/plan";
        const headers = { 'Authorization': 'Bearer ' + token }
        return this.http.post<any>(addPlanUrl, file, { headers, observe: 'response' }).pipe(map((data:any)=>{
            return data
        }))
    }
    getPlan(token: string, organizationGUID: string, objectID:string, planID:string): Observable<IObject[]> {
        let getPlanUrl = "https://rentobjects.onrender.com/organizations/" + organizationGUID + "/objects/" + objectID + "/plan/" + planID;
        const headers = { 'Authorization': 'Bearer ' + token }
        return this.http.get(getPlanUrl, { headers, responseType: 'blob' }).pipe(map((data:any)=>{
            return data
        }))
    }
    addPolygon(token: string, organizationGUID: string, objectID:string, polygons: IPolygon[]): Observable<IObject[]> {
        let addPolygonUrl = "https://rentobjects.onrender.com/organizations/" + organizationGUID + "/objects/" + objectID + "/polygon";
        const headers = { 'Authorization': 'Bearer ' + token }
        let body = polygons
        return this.http.post(addPolygonUrl, body, { headers, observe: 'response' }).pipe(map((data:any)=>{
            return data
        }))
    }
}