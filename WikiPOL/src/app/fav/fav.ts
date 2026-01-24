import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from '../services/articles-service';
import { Article } from '../models/Article';
import { AuthService } from '../services/authservice';

@Component({
  selector: 'app-fav',
  imports: [],
  templateUrl: './fav.html',
  styleUrl: './fav.css',
})
export class Fav {
  private router = inject(Router);
  private articlesService = inject(ArticlesService);
  private authService = inject(AuthService);

  articles = signal<Article[]>([]); // array reactiu d'articles

  constructor() {
    this.loadArticles();
  }

  loadArticles() {
    if(this.authService.isLoggedIn()){
      this.articlesService.getFavorites().subscribe((articlesArray: Article[]) => {
        this.articles.set(articlesArray);
      });
    }

}

   openArticle(id: string){
    this.router.navigate(['/articles/search/expand', id]);
  }
}
