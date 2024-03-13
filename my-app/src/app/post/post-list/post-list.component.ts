import { Component, Input } from '@angular/core';

import {Post} from './../../posts/post.model'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  // posts = [
  // {
  //   title: 'First post', content:'This is the first post\'s'
  // },
  // {
  //   title: 'Second post', content:'This is the first post\'s'
  // },
  // {
  //   title: 'Third post', content:'This is the first post\'s'
  // }

  // ]
 @Input() posts: Post[] = [];
}
