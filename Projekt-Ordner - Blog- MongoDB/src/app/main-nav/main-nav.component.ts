import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {


  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  name: string;

  // Getter 

  getBoolean() {
    console.log(this.userIsAuthenticated);
  }

  getUsername() {
    return this.authService.getName();
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.name = this.authService.getName();
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logoutUser();
  }


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
