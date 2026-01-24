import { Component, inject, signal } from '@angular/core';
import { ArticlesService } from '../services/articles-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../models/Article';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articlesService = inject(ArticlesService);

  articles = signal<Article[]>([]);

  constructor() {
    this.articlesService.getRandomArticles().subscribe(allArticles => {
      console.log('Artículos recibidos:', allArticles);
      this.articles.set(allArticles);
    });
  }

  openArticle(id: string){
    this.router.navigate(['/articles/search/expand', id]);
  }

}



