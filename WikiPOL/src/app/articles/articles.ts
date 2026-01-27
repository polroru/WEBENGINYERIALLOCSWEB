import { Component, inject, signal } from '@angular/core';
import { ArticlesService } from '../services/articles-service';
import { Article } from '../models/Article';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice';
import { ReportsService } from '../services/reports-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-articles',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './articles.html',
  styleUrl: './articles.css',
})
export class Articles {

  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private articlesService = inject(ArticlesService);
  private reportsService = inject(ReportsService);
  protected authService = inject(AuthService);

  protected article = signal<Article | null>(null); // variable reactiva per l'article
  protected isFav = signal<boolean>(false); // per defecte no és favorit
  protected success = false; // mostra missatge de report creat
  protected loading = signal<boolean>(true); // controla l'estat de carregament

  protected showReport = false; // mostra/oculta l'àrea de report
  protected reportText = ''; // contingut del textarea del report

  constructor() {
    const id = this.route.snapshot.params['id']; // agafem l'id de l'article de la ruta
    this.loadArticle(id); // carreguem l'article
  }

  // Funció per carregar l'article amb loading i comprovar si és favorit
  private loadArticle(id: string) {
    this.loading.set(true); // comencem carregant
    this.articlesService.getArticleById(id).subscribe({
      next: m => {
        this.article.set(m); // assignem l'article rebut
        this.loading.set(false); // ja ha carregat

        // si està loguejat, comprovem si és favorit
        if (this.authService.isLoggedIn()) {
          this.authService.isFavorite(m._id).subscribe(fav => {
            this.isFav.set(fav);
          });
        }
      },
      error: () => {
        // en cas d'error (article eliminat o no trobat)
        this.article.set(null);
        this.loading.set(false); // ja ha carregat
      }
    });
  }

  // Funció per navegar a l'edició de l'article
  onSubmit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/articles/search', this.article()!.title.toLowerCase(), 'edit', this.article()!._id]);
    } else {
      console.log("Inicia sessió");
      this.router.navigate(['/sign-in']);
    }
  }

  // Funció per afegir/eliminar de favorits
  afegirFav() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']); // redirigeix al login
      return;
    }

    const articleId = this.article()!._id;
    this.authService.isFavorite(articleId).subscribe(currentFav => {
      if (currentFav) {
        this.authService.removeFav(articleId).subscribe(() => this.isFav.set(false));
      } else {
        this.authService.postFavorite(articleId).subscribe(() => this.isFav.set(true));
      }
    });
  }

  // Funció per crear un nou report
  crearReport() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const textarea = document.getElementById('newReportText') as HTMLTextAreaElement;
    if (!textarea || !textarea.value.trim()) return;

    const article = this.article();
    if (!article) return;

    this.reportsService.addNewReport({
      articleId: article._id,
      articleTitle: article.title,
      comment: textarea.value
    }).subscribe(() => {
      textarea.value = '';
      this.success = true; // mostrem missatge
      console.log('Nou report creat!');
    });
  }

}
