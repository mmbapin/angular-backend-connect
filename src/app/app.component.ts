import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, retry } from "rxjs/operators";
import { Post } from "./post.model";
import { PostsService } from "./post.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isLoading: boolean = false;
  error: any = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage
    });
    this.fetchPosts()
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts()
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = []
    })
  }

  onHandleError(){
    this.error = null
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe()
  }

  private fetchPosts() {
   this.isLoading = true;
   this.postService.fetchPosts().subscribe((posts) => {
    this.isLoading = false;
    this.loadedPosts = posts;
   }, error => {
    this.isLoading = false;
    this.error = error.message || 'An error occurred!'
   })
  }
}
