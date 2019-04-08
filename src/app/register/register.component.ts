import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; 
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpBackend } from '@angular/common/http';
import { HttpClient } from 'selenium-webdriver/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
  });
  
  constructor(private auth: AuthService, private route: Router) { }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.registerForm.value).subscribe(() => {
      this.route.navigate(['/login'])
    }, (err) => {
      console.log(err);
    })
  }
}
