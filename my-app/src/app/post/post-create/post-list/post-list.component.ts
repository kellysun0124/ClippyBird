import { Component, Input /*, OnInit, OnDestroy */ } from '@angular/core';
import { Post } from "../../post-create/post.model";
// import { PostService } from '../../post.service';

@Component({
  selector: 'post-list', //goes into app.component.html
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent /* implements OnInit, OnDestroy */{
  @Input() posts: Post[]=[];
/*   constructor(public postsService: PostService){

  }
  ngOnInit() {
      this.posts = this.postsService.getPosts();
  }
  ngOnDestroy() {
      this.postsSub.unsubscribe();
  } */
}
