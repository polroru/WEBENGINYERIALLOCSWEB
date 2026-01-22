import { Component, inject } from '@angular/core';
import { ArticlesService } from '../services/articles-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../models/Article';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authservice';
@Component({
  selector: 'app-edit-articles',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-articles.html',
  styleUrl: './edit-articles.css',
})
export class EditArticles {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articlesService = inject(ArticlesService);
  private authService = inject(AuthService);


  article: Article | null = null;

  editArticleForm = new FormGroup({
    title: new FormControl('', {
      validators: Validators.required,
      nonNullable: true
    }),
    content: new FormControl('', {
      validators: Validators.required,
      nonNullable: true
    })
  })

  constructor() {
    let id;
    this.route.params.subscribe(params => {
      id = params['id'];

      this.articlesService.getArticleById(id).subscribe(article => {
        this.article = article;

        this.editArticleForm.patchValue({
          title: article.title,
          content: article.content
        });
      });
    });
  }



  save() {
    if(this.editArticleForm.valid){
      const articleToUpdate = {
        id: this.article!.id,
        title: this.editArticleForm.value.title,
        content: this.editArticleForm.value.content
    };

  this.articlesService.editArticle(articleToUpdate).subscribe(updatedArticle => {
    this.router.navigate(['/articles/search/expand', updatedArticle.id]);
  });
    } else {
      console.log('Form no es vàlid');
    }
  }
}


