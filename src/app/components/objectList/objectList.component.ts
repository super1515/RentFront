import {Component, EventEmitter, Input, Output, output} from '@angular/core'
import { ObjectsService } from '../../services/objects.service';
import { IObject } from '../../models/IObject';

@Component({
    selector: 'app-objectList',
    templateUrl: './objectList.component.html'
})
export class ObjectListComponent {
    showAddObjectModalWindow = false
    isLoading = false
    token = ""
    selectedOrganization = ""
    objects:IObject[] = []
    selectedObjectID = ""
    newObjectName = ""
    @Output() onObjectEdit = new EventEmitter<{object: IObject, objects: IObject[]}>();
    constructor(private objectsService: ObjectsService){
        this.token = localStorage.getItem('token') ?? ''
        this.selectedOrganization = localStorage.getItem('selectedOrganization') ?? ''
    }
    ngOnInit(): void {
        this.getObjects()
    }
    getObjects(){
        this.isLoading = true;
        console.log(this.token + "}}}" + this.selectedOrganization)
        this.objectsService.getObjects(this.token, this.selectedOrganization).subscribe({
        next:(data: IObject[]) => {
            this.isLoading = false
            this.objects = data
            console.log(this.objects)
        },
        error: err => { console.error(err); this.isLoading = false; }
        })
    }
    addObject(){
        this.isLoading = true;
        let newObject: IObject = {
            _id: "null",
            OrganizationGUID: this.selectedOrganization,
            Name: this.newObjectName,
            ParentObjectID: this.selectedObjectID
            };
        console.log(newObject)
        if(this.selectedObjectID === '') delete newObject['ParentObjectID']
        this.objects.push(newObject)
        this.objectsService.addObject(this.token, this.selectedOrganization, this.selectedObjectID, this.newObjectName).subscribe({
            next:(data: any) => {
                this.isLoading = false
                this.getObjects()
                console.log(data)
            },
            error: err => { console.error(err); this.isLoading = false; }
        })
        console.log(this.selectedObjectID)
        this.selectedObjectID = ""
        this.newObjectName = ""
    }
    deleteObject(objectId: string){
        this.objects = this.objects.filter(obj => obj._id !== objectId)
        this.objectsService.deleteObject(this.token, this.selectedOrganization, objectId).subscribe({
            next:(data: any) => {
                this.isLoading = false
                this.getObjects()
                console.log(data)
            },
            error: err => { console.error(err); this.isLoading = false; }
            })
    }
    editObject(selected:string){
        let newObject: IObject = {
            _id: selected,
            OrganizationGUID: this.selectedOrganization,
            Name: "null",
            ParentObjectID: "null"
            };
        this.onObjectEdit.emit({object:this.objects.find(elem => elem._id === selected) ?? newObject, objects:this.objects});
    }
}