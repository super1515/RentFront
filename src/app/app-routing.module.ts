import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LkComponent } from './components/lk/lk.component';
import { ObjectComponent } from './components/object/object.component';

const routes: Routes = [
  {path: '', component: ObjectComponent},
  {path: 'object', component: ObjectComponent},
  {path: 'lk', component: LkComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
