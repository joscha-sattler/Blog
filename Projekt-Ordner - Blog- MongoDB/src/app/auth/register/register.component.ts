import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  
  private authStatusSub: Subscription;
  
  
  //---------------------------------------->
 


  form = new FormGroup({
    // Benutzername
    benutzername: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),

    // E-Mail
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    // Passwort
    passwort: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

  });

   //---------------------------------------->

  constructor(public authService: AuthService) { }
  

  onSignup() {
    if (this.form.invalid){                                                                               // falls Formen nicht korrekt ausgefüllt sind, mache nichts
      return;
    }
    this.authService.registerUser(this.form.value.benutzername, this.form.value.email, this.form.value.passwort);
    this.form.reset();
    //alert("erfolgreich registriert!");
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
    

  onSubmit(){
    alert(JSON.stringify(this.form.value));
  }

}
