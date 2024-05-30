import { Component, Inject, OnInit } from '@angular/core';
import { ObjectsService } from './services/objects.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'RentFront';
  isAuth = false;
  isLoaded = false;
  constructor(private objectsService: ObjectsService,
    @Inject(DOCUMENT) private readonly document: Document){

  }
  private addScript(scriptSrc: string) {
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;
    script.async = true;
    this.document.head.appendChild(script);
}
  ngOnInit(): void {
    this.addScript('js/draw.js');
    setTimeout(() => {
      if(window.localStorage.getItem('token')) this.isAuth = true;
      this.isLoaded = true;
    });
  }
}
