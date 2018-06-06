import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
 
 
export class GetreviewsserviceService {

  constructor(private db: AngularFireDatabase) { }
  
  // getting review data from firebase db
  getMovieReview(data){
    return this.db.list('/reviews/'+ data.Title, ref => ref.orderByChild('Date'));
  }


}
