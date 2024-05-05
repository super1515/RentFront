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
    isObjectEdit = false
    constructor(private objectsService: ObjectsService){
        this.token = localStorage.getItem('token') ?? ''
        this.selectedOrganization = localStorage.getItem('selectedOrganization') ?? ''
    }
    ngOnInit(): void {

    }
    onObjectEdit(selectedObject: IObject){
        this.isObjectEdit = true
        this.selectedObject = selectedObject
        console.log(selectedObject)
    }
}