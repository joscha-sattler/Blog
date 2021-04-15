import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {


  private authStatusSub: Subscription;

  form = new FormGroup({
    // Benutzername
    benutzername: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),

    // Passwort
    passwort: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

  });

  constructor( public authService: AuthService ) {}


  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onLogin(){
    if ( this.form.invalid) {
      return;
    }
    this.authService.loginUser(this.form.value.benutzername, this.form.value.passwort);
    this.form.reset();
  }

}
