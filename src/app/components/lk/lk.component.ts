import {Component} from '@angular/core'
import { LkService } from '../../services/lk.service';
import { IOrganization } from '../../models/IOrganization';
import { error } from 'node:console';

@Component({
    selector: 'app-lk',
    templateUrl: './lk.component.html'
})
export class LkComponent {
    token = ''
    showModalWindow = false
    selectedOrganization = ''
    addedOrganizationName = ''
    infoMessages: string[] = [];
    isLoading = false
    organizations : IOrganization[] = []
    constructor(private lkService: LkService){
        this.token = localStorage.getItem('token') ?? ''
        this.selectedOrganization = localStorage.getItem('selectedOrganization') ?? ''
    }
    getOrganizations(){
        this.isLoading = true;
         this.lkService.getOrganizations(this.token).subscribe({
            next:(data: IOrganization[]) => {
                this.isLoading = false
                this.organizations = data
            },
            error: err => { console.error(err); this.isLoading = false; }
        })
        
    }
    selectOrganization(id: string){
        this.selectedOrganization = id
        localStorage.setItem('selectedOrganization', id)
    }
    addOrganization(){
        this.isLoading = true
        this.lkService.addOrganization(this.token, this.addedOrganizationName).subscribe({
            next:(data : any) => {
                this.isLoading = false
                this.showModalWindow = false
                if(data.status === 200) {
                    this.infoMessages = ["Организация успешно добавлена"]
                    window.location.reload();
                }
                else 
                    this.infoMessages = ["Ошибка добавления организации"]
            }
        })
    }
    deleteOrganization(id: string){
        this.isLoading = true
        this.lkService.deleteOrganization(this.token, id).subscribe({
            next:(data: any) => {
                this.isLoading = false
                if(data.status === 200) {
                    this.infoMessages = ["Организация успешно удалена"]
                    window.location.reload();
                }
                else 
                    this.infoMessages = ["Ошибка удаления организации"]
            }
        })
    }
    ngOnInit(): void {
        this.getOrganizations()
      }
    modalWindowChangeState(){
        this.showModalWindow = !this.showModalWindow
    }
}