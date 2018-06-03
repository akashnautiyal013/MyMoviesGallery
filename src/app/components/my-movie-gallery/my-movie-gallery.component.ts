import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-my-movie-gallery',
  templateUrl: './my-movie-gallery.component.html',
  styleUrls: ['./my-movie-gallery.component.css']
})
export class MyMovieGalleryComponent implements OnInit {
  responseData:object={};
  constructor(private router: Router,private route: ActivatedRoute) {

  	
   }
  
  
  ngOnInit() {
  this.route.queryParams.subscribe(params => {
        console.log(params['cardDetail']);
        this.responseData = JSON.parse(params['cardDetail']);
    });
  }

}
