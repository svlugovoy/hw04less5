import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Post} from "../../models/post";
import {PostService} from "../../services/post.service";
import {FormGroup} from "@angular/forms";
import {DataExchangeService} from "../../services/data-exchange.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-post-form',
  templateUrl: './add-post-form.component.html',
  styleUrls: ['./add-post-form.component.css']
})
export class AddPostFormComponent implements OnInit {

  @ViewChild('f') f: FormGroup;

  @Output() onAddPostEE: EventEmitter<Post> = new EventEmitter<Post>();
  @Output() onEditPostEE: EventEmitter<Post> = new EventEmitter<Post>();

  post: Post = {
    userId: 1,
    title: '',
    body: ''
  };

  constructor(
    private postService: PostService,
    private dataExchangeService: DataExchangeService,
    public toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.dataExchangeService.editTaskEvent.subscribe((postData: Post) => {
      this.post = postData;
    });
  }

  onAddNewPost() {
    const newPost: Post = {
      userId: 1,
      title: this.post.title,
      body: this.post.body
    };
    this.postService.createPost(newPost).subscribe((response) => {
        this.onAddPostEE.emit(response);
        this.toastr.success('Post created.', 'Created!');
      },
      (error) => {
        this.toastr.error(error.message, 'Error!');
      });
    this.f.reset();
  }

  onEditPost() {
    const editedPost: Post = {
      userId: 1,
      title: this.post.title,
      body: this.post.body,
      id: this.post.id
    };
    if (editedPost.id > 100) {
      this.onEditPostEE.emit(editedPost);
      this.toastr.success('Post updated.', 'Updated!');
    } else {
      this.postService.editPost(editedPost).subscribe((response) => {
          this.onEditPostEE.emit(response);
          this.toastr.success('Post updated.', 'Updated!');
        },
        (error) => {
          this.toastr.error(error.message, 'Error!');
        });
    }

    this.dataExchangeService.emitEditEvent({title: '', body: '', userId: 1});
    this.f.reset();
  }

  onCancel() {
    this.dataExchangeService.emitEditEvent({title: '', body: '', userId: 1});
    this.f.reset();
  }


}
