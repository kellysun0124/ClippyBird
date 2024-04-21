import { Component } from '@angular/core';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  submitLogin() {
    this.userService.login(this.username, this.password)
      .subscribe(
        () => {
          // Successful login, redirect or perform other actions
        },
        error => {
          this.errorMessage = error.message;
        }
      );
  }
}

