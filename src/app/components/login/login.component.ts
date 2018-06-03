import { Component, OnInit } from '@angular/core';
import {UserRegistrationService} from '../../services/user-registration.service';
import {Router , NavigationExtras} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router,public UserRegistrationService:UserRegistrationService) {
    
      UserRegistrationService.getCurrentUser().subscribe(
        (user) => {
          if (user) {
            this.router.navigate(['home']);
          }
            else{
              return;
            }
          })
  }

  ngOnInit() {
  }

  login(){
  	this.UserRegistrationService.loginWithGoogle().then(user=>{
  		this.router.navigate(['home']);
  	})
  }

  loginWithFb(){
    this.UserRegistrationService.loginWithFacebook().then(user=>{
      this.router.navigate(['home']);
    })
  }

}
