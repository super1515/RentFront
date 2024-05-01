import {Component} from '@angular/core'
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html'
})
export class NavComponent {
    constructor(private router: Router){}
    logout(){
        window.localStorage.removeItem('token');
        window.location.reload();
    }
    go(){
        this.router.navigate(["/lk"]);
    }
}