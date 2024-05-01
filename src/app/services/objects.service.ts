import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {IObject} from '../models/object'
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})

export class ObjectsService {
    constructor(private http: HttpClient){

    }

    getAll(): Observable<IObject[]> {
        return this.http.get<IObject[]>('https://fakestoreapi.com/products', {
            params: new HttpParams().append('limit', 5)
        })
    }
}