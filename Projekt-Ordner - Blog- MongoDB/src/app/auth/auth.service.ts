import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { RegisterData } from './register.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root'}) // damit der AuthService gefunden werden kann. Erzeugt nur eine Instanz, keine Duplicate möglich.
export class AuthService {
    
    // Attribute
   
    private isAuthenticated = false;
    private token: string;
    private name: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any;
    private userId: string;

    constructor(private http: HttpClient, private router: Router) {
    }

    // Getter

    getToken() {
        return this.token;
    }
    
    getIsAuthenticated() {
      return this.isAuthenticated;
    }

    getName() {
       return this.name;
    }

    getUserId() {
      return this.userId;
    }

    getAuthStatusListener() {
      return this.authStatusListener.asObservable();  
    }




    // weitere Methoden


  registerUser(username: string, email: string, password: string) {
    const registerData: RegisterData = {username: username, email: email, password: password};
    return this.http.post('http://localhost:3000/api/user/signup', registerData).subscribe(() => {
      this.router.navigate(["/"]);
    })
  }


  loginUser(username: string, password: string) {
    const authData: AuthData = { username: username, password: password };
    this.http
      .post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        console.log(token);
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId
          this.authStatusListener.next(true);
          const now = new Date(); //Timestamp des Moments
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000); // aktuelle Zeit + 1h bis Token auslöuft
          const name = authData.username;
          this.name = authData.username;
          console.log(expirationDate);
          this.saveAuthData(token, name, expirationDate, this.userId);
          this.router.navigate(['/storyboard']);
          
        }
      });
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); // andere informieren
    this.userId = null;
    clearTimeout(this.tokenTimer);      // setzt den Timer nach Logiut zurück
    this.clearAuthData();               // Daten aus dem lokalen Spoeicher löschen
    this.router.navigate(['/login']);
  }



  autoAuthUser() { // User wird automatisch authorisiert, sofern der Token & expriationDate & Name im lokalen Speicher sind
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); // prüfen, ob die aktuelle Zeit vor oder nach der gespeicherten expirationdate ist (Zeitraum 1h)
    if (expiresIn > 0) { // wenn die Zeit noch nicht abgelaufen ist, dann für authentifiziert erklären
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId; //sd
      this.name = authInformation.name; 
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }

  // lokal speichern, damit man z:b. nach einem reload der Seite weiterhin eingeloggt ist. + weitere Methoden dazu

  private saveAuthData(token: string, name: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('name', name);
    localStorage.setItem('userId', userId);
  }
  
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');

    if (!token && !expirationDate && !name) {
      return
    }
    return { token: token, name: name, userId: userId, expirationDate: new Date(expirationDate) }
  }

  private setAuthTimer(duration: number) {
    console.log("Timer: " + duration);
    this.tokenTimer = setTimeout(() => {      //timer in Millisekunden, daher mal 1000
      this.logoutUser();
    }, duration * 1000);
  }

}