import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @HostBinding('attr.data-component-id') componentId = 'home'; // Add an extra host attribute
}
