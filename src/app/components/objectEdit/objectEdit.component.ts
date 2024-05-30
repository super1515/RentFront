import {AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild} from '@angular/core'
import { ObjectsService } from '../../services/objects.service';
import { ICustomParams, IObject, IPolygon } from '../../models/IObject';
import { EventEmitter } from 'stream';
import { DropdownModule } from 'primeng/dropdown';
import { delay } from 'rxjs';
declare var myInit:any;
@Component({
    selector: 'app-objectEdit',
    templateUrl: './objectEdit.component.html'
})

export class ObjectEditComponent{
[x: string]: any;
    showAddCustomParamModalWindow = false
    showEditPlanWindow = false
    whereWeStoreTheValue = []
    options = ["12", "123"];
    showEditPlanModalWindow = false
    selectedObjectId: string = ""
    selectedParamId: string = ""
    selectedPolyId: string = ""
    isLoading = false
    curParams: ICustomParams[] = []
    token = ""
    fileName = ""
    planUpdated = false
    fileData:FormData = null!
    selectedOrganization = ""
    newCustomParam:ICustomParams
    @Input({ required: true }) object!: IObject;
    @Input({required: true}) objects!: IObject[];
    constructor(private objectsService: ObjectsService, private renderer: Renderer2){
        this.token = localStorage.getItem('token') ?? ''
        this.selectedOrganization = localStorage.getItem('selectedOrganization') ?? ''
    }
    ngOnInit(): void {
        this.newCustomParam = {
            Name: "",
            Type: "string",
            Value: ""
        }
        //this.getFile()
        
    }
    getObjects(){
        this.isLoading = true;
        this.objectsService.getObjects(this.token, this.selectedOrganization).subscribe({
        next:(data: IObject[]) => {
            this.isLoading = false
            this.object = data.find(item => item._id === this.object._id) ?? this.object
            this.objects = data
            console.log(data)
            this.getFile()
        },
        error: err => { console.error(err); this.isLoading = false; }
        })
    }
    deleteObject(){
        this.objectsService.deleteObject(this.token, this.selectedOrganization, this.object._id).subscribe({
            next:(data: any) => {
                this.isLoading = false
                this.returnBack()
                console.log(data)
            },
            error: err => { console.error(err); this.isLoading = false; }
            })
    }
    addCustomParam(){
        console.log("123")
        console.log(this.newCustomParam)
        this.newCustomParam.Type = 'string'
        console.log(this.newCustomParam)
        this.objectsService.addCustomParams(this.token, this.selectedOrganization, this.object._id, [this.newCustomParam]).subscribe({
            next:(data: any) => {
                this.isLoading = false
                this.getObjects()
                console.log(data)
            },
            error: err => { console.error(err); this.isLoading = false; }
            })
    }
    returnBack(){
        window.location.reload();
    }
    onFileSelected(event:any) {

        const file:File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("uploadedFile", file);
            this.fileData = formData
            //const upload$ = this.http.post("/api/thumbnail-upload", formData);

            //upload$.subscribe();
        }
    }
    sendFile() {
        this.objectsService.addPlan(this.token, this.selectedOrganization, this.object._id, this.fileData).subscribe({
            next:(data: any) => {
                this.isLoading = false
                this.getObjects()
                
                console.log(data)
            },
            error: err => { console.error(err); this.isLoading = false; }
            })
        
    }
    getFile() {
        this.objectsService.getPlan(this.token, this.selectedOrganization, this.object._id, this.object.FileID!).subscribe({
            next:(data: any) => {
                this.isLoading = false
                console.log('file')
                let reader = new FileReader();
                reader.addEventListener("load", () => {
                  this.imageBlobUrl = reader.result;
                }, false);
            
                reader.readAsDataURL(data);
            },
            error: err => { console.error(err); this.isLoading = false; }
            })
        
    }
    updatePlanInfo(){
        console.log('updationg plan')
        if(this.object.Polygons === undefined) { console.log('polygons undefined'); return; }
        for (let i = 0; i < this.object.Polygons?.length; i++) {
            console.log('updationg poly')
            let poly = this.object.Polygons[i];
            const element = document.createElement('area');
            element.setAttribute('shape', 'poly');
            element.setAttribute('coords', poly.coords.join(','));
            if(poly._id !== undefined)
                element.setAttribute('id', poly._id);
            
            element.setAttribute('data-name', "Суматранский тигр")
            document.getElementById('imgmap')?.appendChild(element);
            console.log(document.getElementById('imgmap'))
            console.log(element)
          }
    }
    convertStringToNumberArray(inputString: string) {
        const numbers = inputString.replace(/\s+/g, '').split(',').map(Number);
        return numbers;
    }
    savePlan(){
        let map = <HTMLMapElement>document.getElementById('imgmap');
        let areas = map.getElementsByTagName("area");
    
        for (let i = 0; i < areas.length; i++) {
            let area = <HTMLAreaElement>areas[i]
            if (!area.id || area.id === "") {
                let numbers = this.convertStringToNumberArray(area.getAttribute("coords")!);
                if(this.object.Polygons === undefined || !this.object.Polygons!.some(polygon => JSON.stringify(polygon.coords) === JSON.stringify(numbers))){
                let polygon: IPolygon = {
                    coords: numbers,
                    refIds: []
                }
                if(this.object.Polygons === undefined){
                    this.object.Polygons = [polygon]
                }else
                    this.object.Polygons?.push(polygon)
            }
                console.log(area)
            }
        }
        for (let i = 0; i < this.object.Polygons!.length; i++) {
            if(this.object.Polygons![i].refIds === undefined){
                this.object.Polygons![i].refIds = []
            }
        }
        this.addPolygon();
        
    }
    addPolygon(){
        this.objectsService.addPolygon(this.token, this.selectedOrganization, this.object._id, this.object.Polygons!).subscribe({
            next:(data: any) => {
                this.isLoading = false
                
                console.log(data)
            },
            error: err => { console.error(err); this.isLoading = false; }
            })
    }
    initImg(){
        myInit()
        if(!this.planUpdated){
            this.updatePlanInfo();
            console.log('вешаем события')
            let map = <HTMLMapElement>document.getElementById('imgmap');
            console.log(map)
            this.renderer.listen(map, 'mouseover', (e) => {
                e.preventDefault();
                this.mouseOnArea(e)
                e.stopPropagation();
            })
            this.renderer.listen(map, 'mouseout', (e) => {
                e.preventDefault();
                this.mouseOutOfArea(e)
                e.stopPropagation();
            })
            this.renderer.listen(map, 'click', (e) => {
                e.preventDefault();
                this.mouseClickedOnArea(e)
                e.stopPropagation();
            })
            this.planUpdated = true;
        }

    }
    findParamsByRefs(refs: string[]){
        var out: ICustomParams[] = [];
                for (const refId of refs) {
                    for(let j = 0; j < this.objects.length; j++){
                        let params = this.objects[j].CustomParams
                        for(let k = 0; k < params!.length; k++){
                            let param = params![k]
                            if(param._id === refId){
                                out.push(param)
                            }
                        }
                    }
                }
        return out
    }
    mouseOnArea(event:Event){
        console.log(event)
        var area = event.target;
        var areaId = (<HTMLAreaElement>area).id;
        var str = ""
        if(areaId !== ''){
            const polygonWithId = this.object.Polygons!.find(polygon => polygon._id === areaId);
            if (polygonWithId) {
                var params = this.findParamsByRefs(polygonWithId.refIds)
                for (const param of params) {
                    str += "\n" + param.Name + " " + param.Value
                }
            } else {
                console.log("Element with _id not found");
            }
            var divElem = <HTMLDivElement>document.getElementById("inner");
            divElem.setAttribute("data-name", str.slice(1))
        }
        console.log(areaId)
    }
    mouseOutOfArea(event:Event){
        var divElem = <HTMLDivElement>document.getElementById("inner");
            divElem.setAttribute("data-name", '')
    }
    mouseClickedOnArea(event:Event){
        var areaId = (<HTMLAreaElement>event.target).id;
        if(areaId !== ''){
            const polygonWithId = this.object.Polygons!.find(polygon => polygon._id === areaId);
            this.selectedPolyId = areaId
            this.curParams = this.findParamsByRefs(polygonWithId!.refIds)
            this.showEditPlanModalWindow = true;
        }
    }
    getObjectParamsByObjectId(id: string){
        return this.objects.find(item => item._id === id)?.CustomParams
    }
    saveSelectedPlanParamRef(){
        console.log('разборки')
        console.log(this.object.Polygons!)
        console.log(this.selectedPolyId)
        console.log(this.selectedParamId)
        this.object.Polygons!.find(item => item._id === this.selectedPolyId)?.refIds.push(this.selectedParamId)
        this.addPolygon()
    }
    deletePoly(){
        document.getElementById(this.selectedPolyId)!.outerHTML="";
        const selectedPolygon = this.object.Polygons!.find(item => item._id === this.selectedPolyId);
        if (selectedPolygon) {
            const index = this.object.Polygons!.indexOf(selectedPolygon);
            if (index !== -1) {
                this.object.Polygons!.splice(index, 1);
            }
        }
        this.addPolygon()
    }
    deleteParam(paramId: string){
        const par = this.curParams.find(x => x._id === paramId);
        if (par) {
            const index = this.curParams.indexOf(par);
            if (index !== -1) {
                this.curParams.splice(index, 1);
            }
        }
        const selectedPolygon = this.object.Polygons!.find(item => item._id === this.selectedPolyId);
        const ref = selectedPolygon?.refIds.find(x => x === paramId)!
        if (selectedPolygon) {
            const index = selectedPolygon?.refIds.indexOf(ref);
            if (index !== -1) {
                selectedPolygon?.refIds.splice(index, 1);
            }
        }
        this.addPolygon()
    }
}