import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs"; // eine Art Eventemitter
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" }) // damit die post.service gefunden werden kann. Erzeugt nur eine Instanz, keine Duplicate möglich.

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // Alle Posts bekommen
  
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // für Pagination, also nur bestimmte anzahl an Posts anzeigen lassen etc.
    this.http.get<{ message: string; posts: any; maxPosts: number }>("http://localhost:3000/api/posts" + queryParams)
      .pipe(map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }), maxPosts: postData.maxPosts};
        }))
      .subscribe(transformedPostData => { 
        console.log(transformedPostData);       
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts });
      });
  }

  // einen Post über ID bekommen

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // Post hinzufügen

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{ message: string; post: Post }>("http://localhost:3000/api/posts", postData)
      .subscribe(responseData => {
        this.router.navigate(["/storyboard"]);
      });
  }

  // Bearbeiten von Posts

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {      // prüfen ob File oder String
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null }; // creator wird Serverseitig geregelt, da es sonst Clientseitig maniouliert werden könnte
    }
    this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/storyboard"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }

 /*  getMyPosts(userId: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>('http://localhost:3000/api/posts/' + userId);
  } */

}
