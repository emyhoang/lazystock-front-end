import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token: string;
  private baseURL = 'http://localhost:3000/api';
  

  constructor(private http: HttpClient,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  private request(method, path, data): Observable<any>{
    let request;

    if (method === 'post'){
      if (path === 'login' || path === 'register'){
        request = this.http.post(`${this.baseURL}/${path}`, data)
      }else {
        request = this.http.post(`${this.baseURL}/${path}`, data, { headers: this.defaultHeaders() })
      }
    } else {
      request = this.http.get(`${this.baseURL}/${path}`, { headers: this.defaultHeaders() })
    }

    request = request.pipe(map((data: TokenResponse) => {
      if(data.token){
        this.saveToken(data.token);
      }

      return data
    }));

    return request;
  }

  private defaultHeaders(){
    return { Authorization: `Bearer ${this.getToken()}`}
  }

  public register(user): Observable<any> {
    return this.request('post', 'register', user);
  }

  private saveToken(token: string): void {
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem('mean-token', token);
      this.token = token;
    }
  }

  private getToken(): string {
    if(isPlatformBrowser(this.platformId)){
      if (!this.token) {
        this.token = localStorage.getItem('mean-token');
      }
      return this.token;
    } else{
      return null;
    } 
  }

  public logout(): void {
    if(isPlatformBrowser(this.platformId)){
      this.token = '';
      window.localStorage.removeItem('mean-token');
      this.router.navigateByUrl('/');
    }
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();

    let payload;

    if(token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}

export interface UserDetails {
  _id: String,
  email: string;
  name: string;
  exp: number;
  iat: number;
}

export interface TokenResponse {
  token: string;
}