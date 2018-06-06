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
     // calling user service and getting current user
      UserRegistrationService.getCurrentUser().subscribe(
        (user) => {
          if (user) {
            // if user exist navigate to home screen
            this.router.navigate(['home']);
          }
            else{
              // if user does not exist do nothing
              return;
            }
          })
  }

  ngOnInit() {
  }
 
  login(){
    // calling loginWithGoogle frunction from UserRegistrationService
  	this.UserRegistrationService.loginWithGoogle().then(user=>{
      // navigating to home screen
  		this.router.navigate(['home']);
  	})
  }

  loginWithFb(){
     // calling loginWithFacebook frunction from UserRegistrationService
    this.UserRegistrationService.loginWithFacebook().then(user=>{
      this.router.navigate(['home']);
    })
  }

}
