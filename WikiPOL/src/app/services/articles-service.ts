import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/Article';
import { AuthService } from './authservice';


@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private http = inject(HttpClient);
  private url = "http://localhost:3000";
  private authService = inject(AuthService);



  //funcions http
  getArticles(title: string): Observable<Article[]>{
    return this.http.get<Article[]>(`${this.url}/articles/${title.toLowerCase()}`);
  }


  getFavorites(): Observable<Article[]>{
    console.log("Envio para coger favs");
    console.log("Token que envío:", this.authService.userToken);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });
    return this.http.get<Article[]>(`${this.url}/articles/favorites`, { headers });
    //ha de confiar, si accedeix a aquesta funcio es que per lo menys ha iniciat sesio, despres comprovem si segueix activa
  }

  addArticle(articleData: Partial<Article>): Observable<Article> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });
    const body = {articleData};
    return this.http.post<Article>(`${this.url}/articles`, body, { headers });
  }


  //put permet editar els camps ja creats
  editArticle(articleData: Partial<Article>): Observable<Article> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}`
    });
    const body = {articleData};

    return this.http.put<Article>(`${this.url}/articles/edit/${articleData.id}`, body, { headers });
  }

  getRandomArticles(): Observable<Article[]> {
    return this.http.get<Article[]>((`${this.url}/articles`));
  }

  getArticleById(id: Number): Observable<Article>{
    return this.http.get<Article>(`${this.url}/articles/expand/${id}`);
  }




}

