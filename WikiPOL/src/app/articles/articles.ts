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
  private router = inject(Router);
  private articlesService = inject(ArticlesService);
  private reportsService = inject(ReportsService);
  protected authService = inject(AuthService);
  protected article = signal<Article | null>(null); // inicializado, signal es una variable reactica, es decir, que notifica de los cambios
  protected isFav = signal<boolean>(false); // per defecte es no fav, pero no te res a veure
  protected success = false; //comentar
  




  protected showReport = false;
  protected reportText = '';

  constructor() {
    const id = this.route.snapshot.params['id']; //asigna el valor de :title a la variable title, estoy cogiendo id del parametro al que me subscribo
    this.articlesService.getArticleById(id).subscribe(m => { //observable para la comunicacion http, con el objeto article
      this.article.set(m); //set en el objeto article (signal)

      if(this.authService.isLoggedIn()){
        this.authService.isFavorite(m._id).subscribe(fav => {
          this.isFav.set(fav); // true si ya es favorito, false si no
        });
      }


    });
}

  onSubmit(){
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/articles/search', this.article()!.title.toLowerCase(), 'edit', this.article()!._id]);
    }else{
      console.log("Inicia sesió");
      this.router.navigate(['/sign-in']);
    }
  }


  afegirFav(){
    console.log("boton apretado");
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/sign-in']); // redirigx al login
    }else{
      console.log("hola");
      const articleId = this.article()!._id;
      this.authService.isFavorite(articleId).subscribe(currentFav => {
      if(currentFav) {
        this.authService.removeFav(articleId).subscribe(() => this.isFav.set(false));
      } else {
        this.authService.postFavorite(articleId).subscribe(() => this.isFav.set(true));
      }
      });
    }
  }

  //COMENTAR

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
    this.success = true;
    console.log('Nuevo report creado!');
    });
  }

}
