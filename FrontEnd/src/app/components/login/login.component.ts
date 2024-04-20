import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @HostBinding('attr.data-component-id') componentId = 'login';

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  submitLogin() {
    this.authService.login(this.username, this.password).subscribe((response) => {
      if (response.message == "User successfully logged in") {
        this.router.navigate(['/user-birds']);
        console.log(response.message);
      } else {
        console.error('Login failed:', response.message);
      }
    });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// interface LoginResponse {
//   success: boolean;
//   message: string;
//   token?: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   constructor(private http: HttpClient) {}

//   login(username: string, password: string): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>('http://localhost:3001/login', { username, password }).pipe(
//       tap((response: LoginResponse) => {
//         if (response.success && response.token) {
//           localStorage.setItem('token', response.token); // Store token in local storage
//         }
//       })
//     );
//   }

//   logout(): void {
//     localStorage.removeItem('token'); // Remove token from local storage on logout
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token'); // Check if user is logged in based on token presence
//   }
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   submitLogin() {
//     this.authService.login(this.username, this.password).subscribe((result) => {
//       if (result.success) {
//         // Login successful, navigate to homepage
//         this.router.navigate(['/homepage']);
//       } else {
//         // Handle login error
//         console.error('Login failed:', result.message);
//       }
//     });
//   }
// }
