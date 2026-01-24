import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private url = "http://localhost:3000";
  userToken: string | null = null;
  currentUser = signal<string | null>(null);
  private router = inject(Router);


  //recuperem token quan sortim del servei angular i tornem a entrar
  constructor() {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.userToken = token;
      this.loadCurrentUser();
    }

  }

  signIn(userData: Partial<User>): Observable<{user: User, token: string}> {
    return this.http.post<{user: User, token: string}>(`${this.url}/user/signin`, userData);
  }

  signUp(userData: Partial<User>): Observable<{user: User, token: string}>{
    const signUpUser = this.http.post<{user: User, token: string}>(`${this.url}/user/signup`, userData);

    return signUpUser;
  }

  isLoggedIn(): boolean{
    return this.userToken != null;
  }

  logout() {
    this.userToken = null;
    localStorage.removeItem('userToken');//borrem token
    this.currentUser.set(null); //borrme usuari guardat
    this.router.navigate(['/sign-in']); // redirigx al login
  }



  /*listenChanges(){
    this.router.events.subscribe(e => {
      if(!this.isLoggedIn()){
        this.router.navigate(['/sign-in']); // redirigx al login
      }
    })
  }*/



    //serveix per a quan faig f5 o surot de la pagina mantenir sessio oberta.
  loadCurrentUser(){
    if (!this.userToken) return;

    const headers = { Authorization : `Bearer ${this.userToken}` };


     //estic rebent info perillosa (password y email) que no necessito, tot i que la password sigui hasheada, ideal fer canvi a nomes username i favorites
    this.http.get<User>(`${this.url}/user/me`, { headers })
      .subscribe({
        next: user => this.currentUser.set(user.username),
        error: () => this.logout() // fa logout si token ha expriat
      });
  }



  postFavorite(articleId: string): Observable<{message: string}> {
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.userToken || ''}`
    });
    return this.http.put<{ message: string }>(`${this.url}/user/addfavorite/${this.currentUser()}`, {articleId}, { headers });
    }



    //borrar favorit
  removeFav(articleId: string): Observable<{message: string}> {
    const username = this.currentUser();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.userToken || ''}`
    });

    const params = { articleId: articleId.toString() };

    return this.http.delete<{ message: string }>(
      `${this.url}/user/removefavorite/${username}`,
      { headers, params } //siempre se tiene que llamar params, si lo meto en el argumento con headers
    );
  }


  isFavorite(articleId: string): Observable<boolean>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.userToken || ''}`
    });
    const params = {articleId: articleId.toString()}; //params = query string --> isfavorite/pol?articleId=2
    return this.http.get<boolean>(`${this.url}/user/isfavorite/${this.currentUser}`, {headers, params} );
    /*
      EN UN GET -> PARAMS I QUERY                           GET Y DELETE
      EN UN POST -> PARAMS, BODY I FINS A 1 ALTRE DADA      POST PUT Y PATCH
    */
  }


}

