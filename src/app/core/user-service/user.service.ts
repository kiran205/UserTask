import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private taskUrl = environment.postUrl;

  constructor(private http: HttpClient) { }

  postdata(form: any): Observable<any> {
    const url = `${this.taskUrl}`;
    return this.http.post<any>(url, form);
  }

  getdata(): Observable<any> {
    const url = `${this.taskUrl}`;
    return this.http.get<any>(url);
  }

  deletePost(id: number): Observable<any> {
    const url = `${this.taskUrl}/${id}`;
    return this.http.delete<any>(url);
  }

  updatePosts(data: any): Observable<any> {
    const url = `${this.taskUrl}/${data.id}`;
    return this.http.put<any>(url, data);
  }


}
