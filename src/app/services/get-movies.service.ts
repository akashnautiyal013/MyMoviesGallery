
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class GetMoviesService {

  constructor(private db: AngularFireDatabase) { }
  // fetching users my gallery movies from db
  getMovies(user){
    return this.db.list('/movies/'+user.uid);
  }

}