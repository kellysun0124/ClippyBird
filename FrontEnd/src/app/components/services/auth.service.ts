import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: any; // Store user session information

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const userData = { userId: username, password: password };
    return this.http.post<any>(`${environment.apiUrl}/api/login`, userData);
  }

  saveLoggedInUser(user: any) {
    this.loggedInUser = user;
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  logout() {
    this.loggedInUser = null;
  }
}
