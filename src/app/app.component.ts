import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, retry } from "rxjs/operators";
import { Post } from "./post.model";
import { PostsService } from "./post.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isLoading: boolean = false;

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {
    this.fetchPosts()
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content).subscribe((response) => {
      if(response){
        this.fetchPosts()
      }
    });
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

  private fetchPosts() {
   this.isLoading = true;
   this.postService.fetchPosts().subscribe((posts) => {
    this.isLoading = false;
    this.loadedPosts = posts;
   })
  }
}
