import { Component, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "./post.model";
// import { PostService } from "../post.service";

@Component({
  selector:'post-create', //goes into app.component.html
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent { //goes into app.modules.ts
  randomString = 'No Content';
  binding = '';

  @Output() postCreated = new EventEmitter<Post>(); // 2. create event emitter

  /* constructor(public postsService: PostService){

  } */

  onAddPost(form: NgForm) {
    const post: Post = {
      title: form.value.title,
      content: form.value.content};
      this.postCreated.emit(post); // 3. send through function
    }
    post = {
      random: this.randomString
    }
}
