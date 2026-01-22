import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticlesService } from '../services/articles-service';
import { Router } from '@angular/router';
import { AuthService } from '../services/authservice';
@Component({
  selector: 'app-add-articles',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-articles.html',
  styleUrl: './add-articles.css',
})

export class AddArticles {

  private articlesService = inject(ArticlesService);
  succes = false;
  private authService = inject(AuthService);



  articleForm = new FormGroup({
    title: new FormControl('', {
      validators: Validators.required, //nos aseguramos que el usuario no deje vacio este campo
      nonNullable: true //para
    }),
    content: new FormControl('', {
      validators: Validators.required,
      nonNullable: true
    })
  })

  onSubmit() {
    if(this.articleForm.valid){
      this.articlesService.addArticle(this.articleForm.value).subscribe(newArticle => {
        this.succes = true; //posem una variable de control per a poder dir que s'ha creat correctament
        this.articleForm.reset(); //fem un reset del formulari (en blanc)
      })
    }else{
      console.log('Form no es vàlid');
    }
  }

}
