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
  currentUser = signal<User | null>(null);
  private router = inject(Router);


  //recuperem token quan sortim del servei angular i tornem a entrar
  constructor() {
    const token = localStorage.getItem('userToken');
    const user = localStorage.getItem('currentUser'); 

    if (user) this.currentUser.set(JSON.parse(user)); // <--- en el cas de tindre el user guardat al localstorage, ho guardem com a currentUser

    if (token && !user) { //en el cas de tindre el token pero no el user, fem un request del user 
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
    localStorage.removeItem('userToken'); // borrem token
    localStorage.removeItem('currentUser'); //borrem info del usuari guardat al local storage
    this.currentUser.set(null);            // borrem usuari
    this.router.navigate(['/sign-in']);    // redirigim al login
  }




    //serveix per a quan faig f5 o surot de la pagina mantenir sessio oberta.
  loadCurrentUser(){
    if (!this.userToken) return;

    const headers = { Authorization : `Bearer ${this.userToken}` };


     //rebo el username
    this.http.get<User>(`${this.url}/user/me`, { headers })
      .subscribe({
      next: user => this.currentUser.set(user), // guardem tot l'usuari
        error: () => this.logout() // fa logout si token ha expriat
      });
  }



  postFavorite(articleId: string): Observable<{message: string}> {
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.userToken || ''}`
    });
    return this.http.put<{ message: string }>(`${this.url}/user/addfavorite/${this.currentUser()!.username}`, {articleId}, { headers });
    }



    //borrar favorit
  removeFav(articleId: string): Observable<{message: string}> {
    const username = this.currentUser()!.username; //agafem username del usuari actual
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

