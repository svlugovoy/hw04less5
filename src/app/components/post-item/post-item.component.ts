import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../../models/post";
import {Comment} from '../../models/comment';
import {CommentService} from "../../services/comment.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {DataExchangeService} from "../../services/data-exchange.service";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input('post') post: Post;

  @Output() deletePost: EventEmitter<number> = new EventEmitter();

  isAdmin = true;

  editPostId: number;

  constructor(
    public commentService: CommentService,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private dataExchangeService: DataExchangeService
  ) { }

  ngOnInit() {
    this.dataExchangeService.editTaskEvent.subscribe((postData: Post) => {
      if (postData.id === this.post.id) {
        this.editPostId = postData.id;
      } else {
        this.editPostId = 0;
      }
    });
  }

  showCommentsForPost(post: Post) {
    if (!post.comments) {
      this.spinner.show();
      this.commentService.getCommentsByPostId(post.id).subscribe((comments: Comment[]) => {
          post.comments = comments;
          this.spinner.hide();
        },
        (error) => {
          this.toastr.error(error.message, 'Error!');
        });
    }
    post.showComments = !post.showComments;
  }

  onDelete(id: number) {
    this.deletePost.emit(id);
  }

  onEdit(post: Post) {
    const updatedPost: Post = {
      userId: post.userId,
      title: post.title,
      body: post.body,
      id: post.id
    };
    this.dataExchangeService.emitEditEvent(updatedPost);
  }

  onCancel() {
    this.dataExchangeService.emitEditEvent({title: '', body: '', userId: 1});
  }

}
