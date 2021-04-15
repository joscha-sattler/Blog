import { Injectable } from '@angular/core';
import { Subject} from 'rxjs'; // eine Art Eventemitter
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';


import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'}) // damit der StoryboardService gefunden werden kann. Erzeugt nur eine Instanz, keine Duplicate möglich.

export class StoryboardService {

    private isDiplay = false;

    getIsDisplay () {
        return this.isDiplay;
    }

    toggleIsDisplay() {
        this.isDiplay = !this.isDiplay;
    }



  constructor(private http: HttpClient, private router: Router) {
  }


}
