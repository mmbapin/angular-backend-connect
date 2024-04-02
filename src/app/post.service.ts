import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {
  url: string = "https://ng-complete-guide-ed6c4-default-rtdb.firebaseio.com/posts.json";
  error = new Subject

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string){
    const postData: Post = {title: title, content: content};
    console.log(postData);
    return this.http
      .post<{ name: string }>(
        this.url,
        postData,
        {
          observe: 'response'
        }
      ).subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message)
      })
  }

  fetchPosts(){
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>(
        this.url,
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          params: searchParams
        }
      )
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          console.log("Post Data :", postArray)
          return postArray;
        }),
        catchError(errorRes => {
          //Send to analytics server
          return throwError(errorRes);
        })
      )
  }

  deletePosts(){
    return this.http.delete(this.url)
  }
}

