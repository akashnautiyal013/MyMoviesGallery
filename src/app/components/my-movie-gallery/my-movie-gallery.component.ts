import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import * as firebase from "firebase/app";
import { Injectable } from "@angular/core";
import * as moment from 'moment';
import {GetreviewsserviceService} from '../../services/getreviewsservice.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-my-movie-gallery',
  templateUrl: './my-movie-gallery.component.html',
  styleUrls: ['./my-movie-gallery.component.css']
})
@Injectable()
export class MyMovieGalleryComponent implements OnInit {

   movieData:any;
   userDetails:any;
   reviewMsg:string='';
   date : string='';
   totalCommentCount = 0;
   RowsmovieReviews: AngularFireList<any>;
   proyectos: Observable<any[]>;



   constructor(private router: Router,private route: ActivatedRoute, private firebasedb: AngularFireDatabase,private GetreviewsserviceService:GetreviewsserviceService) {


      // getting parameters from routes 
      this.route.queryParams.subscribe(params => {
        // setting movie detail to movieData an object
        this.movieData = JSON.parse(params['cardDetail']);
        // setting user detail to userDetails an object
        this.userDetails  = JSON.parse(params['userDetails']);
        // setting now date in 6 Jun 2018 format
        this.date = moment().format('D MMM YYYY');
     
        // calling getMovieReviewList function we have created below and passing parameter for futhur querys

        this.RowsmovieReviews = GetreviewsserviceService.getMovieReview(this.movieData);
        this.proyectos = this.RowsmovieReviews.snapshotChanges().map(changes => {
          this.totalCommentCount = changes.length;
          console.log('changes',changes);
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        }); 
       
      });
  	
   }

    // function get calls when review inputText gets edited by user 
    onInputTextEdit(event, data) {
      if (data == 13) {
        // if user press the enter key
        this.onSubmitReview();
        
      }
    }

    // when user press submit button or presses enter 
    onSubmitReview(){

       // pushing review data to firebase db
       firebase.database().ref("reviews/"+ this.movieData.Title)
       .push({
          Review:this.reviewMsg,
          Name:this.userDetails.displayName,
          Userimg:this.userDetails.photoURL,
          Date:this.date,
        });
    }

    ngOnInit() {
     
    }

}
