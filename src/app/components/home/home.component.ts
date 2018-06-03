import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { UserRegistrationService } from "../../services/user-registration.service";
import { Router, NavigationExtras } from "@angular/router";
// import {FirebaseListObservable } from 'angularfire2';
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
    ])
  ]
})
@Injectable()
export class HomeComponent implements OnInit {
  movies: AngularFireList<any>;
  user: Observable<firebase.User>;
  proyectos: Observable<any[]>;
  loading = true;
  userId: string = "";

  constructor(
    private router: Router,
    public UserRegistrationService: UserRegistrationService,
    private http: Http,
    private firebasedb: AngularFireDatabase
  ) {

    UserRegistrationService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.movies = this.firebasedb.list("movies/" + this.userId);
        this.proyectos = this.movies.snapshotChanges().map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
        this.http
          .get("http://www.omdbapi.com/?s=" + "2018" + "&apikey=PlsBanMe")
          .subscribe(res => {
            this.responseData = res.json().Search;
            this.searchResult = "New Movies";
          });
        this.getMovieList(user);
      } else {
        this.router.navigate(["login"]);
      }
    });


  }

  ngOnInit() {}

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

  onSearch(event, data) {
    if (data == 13) {
      this.searchMovie();
    }
    this.searchValue = event.target.value;
    this.url =
      "http://www.omdbapi.com/?s=" + this.searchValue + "&apikey=PlsBanMe";
  }

  searchMovie() {
    this.http.get(this.url).subscribe(res => {
      this.responseData = res.json().Search;
      this.searchResult = "SEARCH RESULTS";
    });
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

  pushToMyMovieGallery(event) {
    this.movies.push({
      Title: event.Title,
      Type: event.Type,
      Poster: event.Poster,
      Year: event.Year
    });
  }
}
