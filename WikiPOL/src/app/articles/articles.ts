import { Component, inject, signal } from '@angular/core';
import { ArticlesService } from '../services/articles-service';
import { Article } from '../models/Article';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice';


@Component({
  selector: 'app-articles',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './articles.html',
  styleUrl: './articles.css',
})
export class Articles {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articlesService = inject(ArticlesService);
  private authService = inject(AuthService);
  protected article = signal<Article | null>(null); // inicializado, signal es una variable reactica, es decir, que notifica de los cambios
  protected isFav = signal<boolean>(false); // per defecte es no fav, pero no te res a veure

  constructor() {
    this.route.params.subscribe(params => { //observable para ver si cambian los parametros dinamicos (:title)
      const id = params['id']; //asigna el valor de :title a la variable title, estoy cogiendo id del parametro al que me subscribo
      this.articlesService.getArticleById(id).subscribe(m => { //observable para la comunicacion http, con el objeto article
        this.article.set(m); //set en el objeto article (signal)

        if(this.authService.isLoggedIn()){
          this.authService.isFavorite(m._id).subscribe(fav => {
            this.isFav.set(fav); // true si ya es favorito, false si no
          });
        }


      });
    });
  }

  onSubmit(){
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/articles/search', this.article()!.title.toLowerCase(), 'edit', this.article()!._id]);
    }else{
      console.log("Inicia sesió");
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
}
