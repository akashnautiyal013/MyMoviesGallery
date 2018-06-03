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

  loginWithGoogle(){
  	const provider = new firebase.auth.GoogleAuthProvider();
  	return this.afAuth.auth.signInWithPopup(provider);
  }

  loginWithFacebook(){
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  
  }

  getCurrentUser(){
  	console.log('firebase.auth().currentUser',this.user)
  	return this.user;
  }


  logout(){
  	this.afAuth.auth.signOut();
  	this.router.navigate(['home']);
  }
}
