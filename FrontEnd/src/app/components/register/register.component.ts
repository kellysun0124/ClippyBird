import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  firstname: string = '';
  lastname: string = '';
  submitRegistration() {
    // this was a test
    // console.log('Username:', this.username);
    // console.log('Password:', this.password);
    // console.log('Email:', this.email);
    // console.log('Name:', this.name);

    //send data to server and verify login info with backend
  }
}
