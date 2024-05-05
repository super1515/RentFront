import { Component, OnInit } from '@angular/core';
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
  constructor(private objectsService: ObjectsService){

  }
  ngOnInit(): void {
    setTimeout(() => {
      if(window.localStorage.getItem('token')) this.isAuth = true;
      this.isLoaded = true;
    });
  }
}
