import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private  userUrl = 'assets/users.json';

  constructor(private http: HttpClient, private router: Router) { }


  login(userName: string, password: string): Observable<any> {
    return this.http.get<any>(this.userUrl)
      .pipe(
        tap(data => {
          console.log(data);
            const userData = data.users.filter(x => (x.name === userName && x.password === password));
            console.log('All: ' + JSON.stringify(userData))
            if(userData.length === 1) {
              localStorage.setItem('loggedInUser', JSON.stringify(userData[0]));
                this.router.navigate(['/userDashboard']);
            }
        }),
      );
  }

logout(): void {
  this.router.navigate(['']);
}
}
