import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { UserRegistrationService } from "../../services/user-registration.service";
import { Router, NavigationExtras } from "@angular/router";
// import {FirebaseListObservable } from 'angularfire2';
import {RatingModule} from "ngx-rating";

import {
  ClickEvent,
  HoverRatingChangeEvent,
  RatingChangeEvent
} from '@angular-star-rating-lib/angular-star-rating';
import { Observable } from "rxjs";
import * as firebase from "firebase/app";
import "rxjs/add/operator/map";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from "@angular/animations";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        query(":enter", style({ opacity: 0 }), { optional: true }),

        query(
          ":enter",
          stagger("100ms", [
            animate(
              "1s ease-in",
              keyframes([
                style({ opacity: 0, transform: "translateY(-10%)", offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: "translateY(10px)",
                  offset: 0.5
                }),
                style({ opacity: 1, transform: "translateY(0)", offset: 1.0 })
              ])
            )
          ]),

          { optional: true }
        ),
        query(
          ":leave",
          stagger("100ms", [
            animate(
              "1s ease-in",
              keyframes([
                style({ opacity: 1, transform: "translateY(0)", offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: "translateY(10px)",
                  offset: 0.5
                }),
                style({
                  opacity: 0,
                  transform: "translateY(-10%)",
                  offset: 1.0
                })
              ])
            )
          ]),
          { optional: true }
        )
      ])
    ]),

    trigger('queryAnimation', [
     transition('* => goAnimate', [
       // hide the inner elements
       query('h1', style({ opacity: 0 })),
       query('.card-text', style({ opacity: 0 })),
 
       // animate the inner elements in, one by one
       query('h1', animate(1000, style({ opacity: 1 }))),
       query('.card-text', animate(1000, style({ opacity: 1 }))),

     ])
   ])

  ]
})
@Injectable()
export class HomeComponent implements OnInit {
 starsCount: number;

  onClickResult: ClickEvent;
  onHoverRatingChangeResult: HoverRatingChangeEvent;
  onRatingChangeResult: RatingChangeEvent;

  exp = '';
 
    goAnimate() {
      this.exp = 'goAnimate';
    }
  movies: AngularFireList<any>;
  proyectos: Observable<any[]>;
  loading = true;
  userId: string = "";

  constructor(
    private router: Router,
    public UserRegistrationService: UserRegistrationService,
    private http: Http,
    private firebasedb: AngularFireDatabase
  ) {

    this.getDefault();

  }



  getDefault(){

    this.UserRegistrationService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.movies = this.firebasedb.list("movies/" + this.userId);
        this.proyectos = this.movies.snapshotChanges().map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
        this.http
          .get("https://www.omdbapi.com/?s=" + "war" + "&apikey=PlsBanMe")
          .subscribe(res => {
            this.loading = false;
            this.responseData = res.json().Search;
            this.searchResult = "Recommended Movies ";
          });
        this.getMovieList(user);
      } else {
        this.router.navigate(["login"]);
      }
    });
  }


  ngOnInit() {
  }

  onClickedCard(cardDetail) {
    let navigationExtras: NavigationExtras = {
      queryParams: { cardDetail: JSON.stringify(cardDetail) }
    };
    this.router.navigate(["mygallery"], navigationExtras);
  }

  searchValue = "";
  url = "";
  searchResult = "";
  responseData: any[] = [];
  Rowsmovies: any[] = [];
  onInputTextEdit(event, data) {
    if (data == 13) {
      this.searchMovie();
    }
    this.searchValue = event.target.value;
    this.url = "https://www.omdbapi.com/?s=" + this.searchValue + "&apikey=PlsBanMe";
  }

  searchMovie(){
    this.searchResult = "";
    this.loading = true;
    this.http.get(this.url).toPromise().then(res => {
       this.loading = false;
       console.log('response');
       if (res != null || res != undefined)  {
         if (JSON.parse((<any>res)._body).Error != null || JSON.parse((<any>res)._body).Error != undefined ) {
        
        this.responseData = [];
        
        this.searchResult = JSON.parse((<any>res)._body).Error;
        
      }else{
      
       
      this.responseData = res.json().Search;

      this.searchResult = "SEARCH RESULTS";


    }
       }
      
    }).catch((err)=>{
      console.log(err);
      // alert('enter some movie name in text');
    })

  }

  getMovieList(user) {
    var userId = user.uid;
    this.firebasedb
      .list("/movies/" + userId)
      .valueChanges()
      .subscribe(data => {
        this.Rowsmovies = data;
        console.log("data", data);
        this.loading = false;
      });
  }

  pushTOMyMovie(event) {
    var userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref("movies/" + userId)
      .push({
        Title: event.Title,
        Type: event.Type,
        Poster: event.Poster,
        Year: event.Year
        //some more user data
      });
  }

  deleteSth(name) {
    firebase
      .database()
      .ref("movies/" + this.userId)
      .child(name)
      .remove()
      .then(res => {
        console.log("res", res);
      });
  }

  logout() {
    this.UserRegistrationService.logout();
  }


  onClick = ($event: ClickEvent) => {
    console.log('onClick $event: ', $event);
    this.onClickResult = $event;
  };

  onRatingChange = ($event: RatingChangeEvent) => {
    console.log('onRatingUpdated $event: ', $event);
    this.onRatingChangeResult = $event;
  };

  onHoverRatingChange = ($event: HoverRatingChangeEvent) => {
    console.log('onHoverRatingChange $event: ', $event);
    this.onHoverRatingChangeResult = $event;
  };

  pushToMyMovieGallery(event) {
    this.movies.push({
      Title: event.Title,
      Type: event.Type,
      Poster: event.Poster,
      Year: event.Year
    });
  }
}
