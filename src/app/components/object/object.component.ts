import {Component, Input} from '@angular/core'
import { ObjectsService } from '../../services/objects.service';
import { IObject } from '../../models/IObject';

@Component({
    selector: 'app-object',
    templateUrl: './object.component.html'
})
export class ObjectComponent {
    showAddObjectModalWindow = false
    isLoading = false
    token = ""
    selectedOrganization = ""
    selectedObject: IObject
    objects: IObject[]
    isObjectEdit = false
    constructor(private objectsService: ObjectsService){
        this.token = localStorage.getItem('token') ?? ''
        this.selectedOrganization = localStorage.getItem('selectedOrganization') ?? ''
    }
    ngOnInit(): void {

    }
    onObjectEdit(obj:{object: IObject, objects: IObject[]}){
        //object: IObject, objects: IObject[]
        obj.object
        this.isObjectEdit = true
        this.selectedObject = obj.object
        this.objects = obj.objects
        console.log(obj.objects)
    }
}