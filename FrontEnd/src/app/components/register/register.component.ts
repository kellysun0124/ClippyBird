import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  submitRegistration() {
    const userData = {
      userId: this.username,
      firstName: this.firstname, 
      lastName: this.lastname, 
      email: this.email, 
      phone: this.phone,
      password: this.password
    };

    this.http.post<any>(`${environment.apiUrl}/api/register`, userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }
}

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })
// export class RegisterComponent {
//   username: string = '';
//   firstname: string = '';
//   lastname: string = '';
//   email: string = '';
//   phone: string = '';
//   password: string = '';
//   submitRegistration() {
//     // this was a test
//     // console.log('Username:', this.username);
//     // console.log('Password:', this.password);
//     // console.log('Email:', this.email);
//     // console.log('Name:', this.name);

//     //send data to server and verify login info with backend
//   }
// }