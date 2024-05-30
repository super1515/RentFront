import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms"
import { ObjectComponent } from './components/object/object.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './components/auth/auth.component';
import { NavComponent } from './components/nav/nav.component';
import { LkComponent } from './components/lk/lk.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ObjectListComponent } from './components/objectList/objectList.component';
import { ObjectEditComponent } from './components/objectEdit/objectEdit.component';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ObjectComponent,
    ObjectListComponent,
    AuthComponent,
    LkComponent,
    LoadingComponent,
    ObjectEditComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DropdownModule,
    BrowserModule,
    BrowserAnimationsModule
    
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
