import { Component, inject, signal } from '@angular/core';
import { ArticlesService } from '../services/articles-service';
import { Article } from '../models/Article';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-articleslist',
  imports: [],
  templateUrl: './articleslist.html',
  styleUrl: './articleslist.css',
})
export class Articleslist {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articlesService = inject(ArticlesService);

  articles = signal<Article[]>([]); // array reactivo de artículos
  title: string = '';

  constructor() {
    this.route.params.subscribe(params => {
      this.title = params['title'];
      this.loadArticles(this.title);
    });
  }

  loadArticles(title: string) {
    this.articlesService.getArticles(title).subscribe((articlesArray: Article[]) => {
      this.articles.set(articlesArray);

      // Si nomes hi ha 1 artilcle
      if (articlesArray.length === 1 && this.title == articlesArray[0].title) {
        const articleId = articlesArray[0]._id;
        this.router.navigate(['/articles/search/expand', articleId]);
      }
    });
  }

   openArticle(id: string){
    this.router.navigate(['/articles/search/expand', id]);
  }
}
