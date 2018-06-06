import { Injectable } from '@angular/core';
import  {AngularFireAuth} from 'angularfire2/auth';
import  {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {Router , NavigationExtras} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  user:Observable<firebase.User>;
  constructor(private router: Router,public afAuth: AngularFireAuth) { 
  	this.user = afAuth.authState;
  	
  }
  
  // login with google
  loginWithGoogle(){
  	const provider = new firebase.auth.GoogleAuthProvider();
  	return this.afAuth.auth.signInWithPopup(provider);
  }
   // login with facebook
  loginWithFacebook(){
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  
  }
  // get current user
  getCurrentUser(){

  	return this.user;
  }

  // logout user
  logout(){
  	this.afAuth.auth.signOut();
    // navigate to login page
  	this.router.navigate(['login']);
  }
}
