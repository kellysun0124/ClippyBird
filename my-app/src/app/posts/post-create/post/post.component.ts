import { Component, EventEmitter, Output } from '@angular/core';

import {Post} from './../../post.model'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  enteredContent = '';
  enteredTitle ='';
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost(){
   const post: Post = {
    title: this.enteredTitle,
     content: this.enteredContent};
     this.postCreated.emit(post);
  }




}
