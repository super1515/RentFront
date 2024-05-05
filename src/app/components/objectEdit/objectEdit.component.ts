import {Component, Input} from '@angular/core'
import { ObjectsService } from '../../services/objects.service';
import { IObject } from '../../models/IObject';

@Component({
    selector: 'app-objectEdit',
    templateUrl: './objectEdit.component.html'
})
export class ObjectEditComponent {
    showAddObjectModalWindow = false
    isLoading = false
    token = ""
    selectedOrganization = ""
    selectedObjectID = ""
    @Input({ required: true }) object!: IObject;
    constructor(private objectsService: ObjectsService){
        this.token = localStorage.getItem('token') ?? ''
        this.selectedOrganization = localStorage.getItem('selectedOrganization') ?? ''
    }
    ngOnInit(): void {
        
    }
    getObjects(){
        this.isLoading = true;
        this.objectsService.getObjects(this.token, this.selectedOrganization).subscribe({
        next:(data: IObject[]) => {
            this.isLoading = false
            this.object = data.find(item => item._id === this.selectedObjectID) ?? this.object
            console.log(data)
        },
        error: err => { console.error(err); this.isLoading = false; }
        })
    }
}