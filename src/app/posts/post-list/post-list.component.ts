import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // Attribute

  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1; // Anfangsseite
  pageSizeOptions = [1, 2, 5, 10]; // hier kann der User bestimmt wv Posts pro Seite angezeigt werden sollen

  userId: string;

  userIsAuthenticated = false; // damit wir später löschen/bearbeiten nur dem eingeloggten User erlauben
  posts: Post[] = []; // Array von/für Posts
  private postsSub: Subscription;

  private authStatusSub: Subscription;

  // tslint:disable-next-line:max-line-length
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {
    // durch public wir eine neue Property kreiert, die die incoming Values darin speichert
  }

  getAuth() {
    console.log(this.userIsAuthenticated);
  }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts; // Array von Posts wird aktualisiert, immer wenn ein neues Value kommt
      });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    // wenn der Paginator sich verändert
    this.currentPage = pageData.pageIndex + 1; // +1 da der Index bei 0 beginnt, aber wir fangen mit 1 an
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage); // um anschließend die Posts neu zu laden / aktualisieren
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
