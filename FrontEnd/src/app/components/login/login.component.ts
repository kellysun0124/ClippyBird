import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @HostBinding('attr.data-component-id') componentId = 'login';

  username: string = '';
  password: string = '';

  submitLogin() {
    // Handle login info submission
    console.log('Username:', this.username);
    console.log('Username:', this.username);

    //send data to server and verify login info with backend
  }
}
