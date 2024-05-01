import { Component, OnInit } from '@angular/core';
import { IObject } from './models/object';
import { ObjectsService } from './services/objects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'RentFront';
  isAuth = false;
  isLoaded = false;
  objects: IObject[] = []
  constructor(private objectsService: ObjectsService){

  }
  ngOnInit(): void {
    setTimeout(() => {
      if(window.localStorage.getItem('token')) this.isAuth = true;
      this.isLoaded = true;
    });
    this.objectsService.getAll().subscribe(objects=>{
      console.log(objects)
      this.objects = objects
    })
  }
}
