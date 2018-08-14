import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/post";
import {PostService} from "../../services/post.service";
import {DataExchangeService} from "../../services/data-exchange.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {

  postsCount: number;

  posts: Post[];

  counterForId: number = 101;

  constructor(
    private postService: PostService,
    private dataExchangeService: DataExchangeService,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.postsCount = this.posts.length;
      this.dataExchangeService.changePostsCount(this.postsCount);
    });
  }

  onAddPost(post: Post) {
    post.id = this.counterForId; // jsonplaceholder always return id=101
    this.counterForId++;
    this.posts.unshift(post);
    this.postsCount = this.posts.length;
    this.dataExchangeService.changePostsCount(this.postsCount);
  }

  onEditPost(post: Post) {
    const updatedPost: Post = this.posts.filter((postItem: Post) => postItem.id === post.id)[0];
    const index = this.posts.indexOf(updatedPost);
    this.posts[index] = post;
  }

  onDeletePost(id: number) {
    if (id > 100) {
      this.posts = this.posts.filter((post: Post) => post.id !== id);
      this.postsCount = this.posts.length;
      this.toastr.success('Post deleted.', 'Deleted!');
      this.dataExchangeService.changePostsCount(this.postsCount);
      return;
    }
    this.postService.deletePost(id).subscribe((data: Object) => {
        this.posts = this.posts.filter((post: Post) => post.id !== id);
        this.postsCount = this.posts.length;
        this.toastr.success('Post deleted.', 'Deleted!');
        this.dataExchangeService.changePostsCount(this.postsCount);
      },
      (error) => {
        this.toastr.error(error.message, 'Error!');
      });
  }

}
