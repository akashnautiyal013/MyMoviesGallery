import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { UserRegistrationService } from "../../services/user-registration.service";
import { Router, NavigationExtras } from "@angular/router";
import { GetMoviesService } from '../../services/get-movies.service';
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
  // creating animations 
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        // search result cards enter animation
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
           // search result cards leave animation
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
    ])

  ]
})



@Injectable()
export class HomeComponent implements OnInit {

  movies: AngularFireList<any>;
  proyectos: Observable<any[]>;
  loading = true;
  userId: string = "";
  userDetail: object ={};
  searchValue = "";
  url = "";
  searchResult = "";
  responseData: any[] = [];
  Rowsmovies: any[] = [];
  constructor(
    private router: Router,
    public UserRegistrationService: UserRegistrationService,
    private http: Http,
    private firebasedb: AngularFireDatabase,
    private getMoviesService:GetMoviesService,
  ) {

    this.getDefault();

  }



  getDefault(){
    // getting current user from UserRegistrationService
    this.UserRegistrationService.getCurrentUser().subscribe(user => {
      if (user) {
        // if user exist
        this.userId = user.uid;
        this.userDetail = user;
        // getting users movie data from getMoviesService 
        this.movies = this.getMoviesService.getMovies(user)          
        this.proyectos = this.movies.snapshotChanges().map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
        // fetching Recommended Movies data from api and setting to listview
        this.http.get("https://www.omdbapi.com/?s=" + "war" + "&apikey=PlsBanMe")
          .subscribe(res => {
            this.loading = false;
            this.responseData = res.json().Search;
            this.searchResult = "Recommended Movies ";
          });
        
      } else {
         // if user does not exist navigate to login screen
        this.router.navigate(["login"]);
      }
    });
  }


  ngOnInit() {


     
  }

  // when user click movie card navigate to detail screen
  onClickedCard(cardDetail) {
    // setting parameter to pass in route navigation which we can access in next mygallery page
    let navigationExtras: NavigationExtras = {
      queryParams: { cardDetail: JSON.stringify(cardDetail) ,userDetails:JSON.stringify(this.userDetail)}
    };
    //navigating to route name mygallery with some parameters defined above
    this.router.navigate(["mygallery"], navigationExtras);
  }

 
  // on edit search textinput this function get called
  onInputTextEdit(event, data) {

    if (data == 13) {
      // if user presses the enter key

      // searchMovie function getting called
      this.searchMovie();
    }

    // setting serchValue 
    this.searchValue = event.target.value;

    // setting url for featching search reasult
    this.url = "https://www.omdbapi.com/?s=" + this.searchValue + "&apikey=PlsBanMe";
  }


  // when user click search movie or presses enter 
  searchMovie(){
    this.searchResult = "";
    this.loading = true;

    // fetching movies from url we set before and setting search result 
    this.http.get(this.url).toPromise().then(res => {
      this.loading = false;
      if (JSON.parse((<any>res)._body).Error != null || JSON.parse((<any>res)._body).Error != undefined ) {
        // if there is some error in response 
        this.responseData = [];
        this.searchResult = JSON.parse((<any>res)._body).Error;
        
      }else{   
        // if there is no error in response
        this.responseData = res.json().Search;
        this.searchResult = "SEARCH RESULTS";

    }
       
      
    }).catch((err)=>{
      console.log(err);
     
    })

  }

 
  // function gets call when user click add to gallery button on card
  pushTOMyMovie(event) {
    var userId = firebase.auth().currentUser.uid;
    // pushing my movies gallery data to firebase db.
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
  
  // function gets called when user click remove button on my gallery section cards.
  deleteSth(name) {

    // removing movies from my movies gallery and firebase db
    firebase
      .database()
      .ref("movies/" + this.userId)
      .child(name)
      .remove()
      .then(res => {
        console.log("res", res);
      });
  }
  
  // when user click logout
  logout() {
    // calling UserRegistrationService and logging out user ;
    this.UserRegistrationService.logout();
  }



 
}
