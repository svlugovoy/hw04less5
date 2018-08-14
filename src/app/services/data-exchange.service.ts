import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Post} from "../models/post";

@Injectable()
export class DataExchangeService {

  private postsCount: BehaviorSubject<number> = new BehaviorSubject(0);
  public currentPostsCount = this.postsCount.asObservable();

  private editTask: BehaviorSubject<Post> = new BehaviorSubject({ title: '', body: '', userId: 1});
  public editTaskEvent = this.editTask.asObservable();

  constructor() {}

  changePostsCount(count: number) {
    this.postsCount.next(count);
  }

  emitEditEvent(post: Post): void {
    this.editTask.next(post);
  }

}
