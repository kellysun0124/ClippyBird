import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface Image {
  DATE_TIME: string;
  GCS_OBJECT_URL: string;
  IMAGE_ID: string;
  IMAGE_LOCATION: string;
  IMAGE_NAME: string;
  SPECIES: string;
  USER_ID: string;
  SIGNED_URL: string;
}

@Component({
  selector: 'app-user-birds',
  templateUrl: './user-birds.component.html',
  styleUrl: './user-birds.component.css'
})
export class UserBirdsComponent {
  userImages: Image[] = [];
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      this.http.get<Image[]>(`http://localhost:3001/api/homepage/${loggedInUser}`).subscribe(
        (response) => {
          this.userImages = response;
          console.log(this.userImages)
        },
        (error) => {
          console.error('Could not get images:', error)
        }
      )
    }
  }

  getImageUrl(image: Image): string {
    console.log(`${image.GCS_OBJECT_URL}/${image.IMAGE_NAME}`)
    return image.SIGNED_URL;
  }
}
