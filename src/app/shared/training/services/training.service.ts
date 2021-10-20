import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private http: HttpClient, private firebase: AngularFireDatabase) { }


  getTrainings(): Observable<any>{
    return this.firebase.list('/training').snapshotChanges().pipe(
      map(response => {
        return (response || [])?.map(item => {
          return {
            $key:item?.key,
            value:item.payload.toJSON()
          }
        })
      }),
      catchError(error => {
        return throwError(error)
      })
    )
  }


}
