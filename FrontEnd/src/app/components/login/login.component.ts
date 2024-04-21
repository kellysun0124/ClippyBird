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
        this.authService.saveLoggedInUser(this.username);
        console.log(response.message);
      } else {
        console.error('Login failed:', response.message);
      }
    });
  }
}
