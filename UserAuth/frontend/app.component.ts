import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <h1>User Authentication</h1>
    <div *ngIf="!token">
      <h3>Register</h3>
      <input [(ngModel)]="registerData.username" placeholder="Username">
      <input [(ngModel)]="registerData.email" placeholder="Email">
      <input [(ngModel)]="registerData.password" type="password" placeholder="Password">
      <button (click)="register()">Register</button>

      <h3>Login</h3>
      <input [(ngModel)]="loginData.email" placeholder="Email">
      <input [(ngModel)]="loginData.password" type="password" placeholder="Password">
      <button (click)="login()">Login</button>
    </div>

    <div *ngIf="token">
      <h3>Welcome, {{ user?.username }}</h3>
      <button (click)="getUser()">Get User Info</button>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class AppComponent {
  registerData = { username: '', email: '', password: '' };
  loginData = { email: '', password: '' };
  user: any;
  token: string | null = null;

  constructor(private http: HttpClient) {}

  register() {
    this.http.post('http://localhost:5000/register', this.registerData)
      .subscribe(() => alert('Registered successfully'));
  }

  login() {
    this.http.post<{ token: string }>('http://localhost:5000/login', this.loginData)
      .subscribe(response => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
      });
  }

  getUser() {
    this.token = localStorage.getItem('token');
    this.http.get('http://localhost:5000/user', { headers: { Authorization: this.token! } })
      .subscribe(data => this.user = data);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.user = null;
  }
}
