import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar{

  private router = inject(Router);
  busqueda = new FormControl('');

  onSubmit() {
    const title = this.busqueda.value?.trim(); //agafa valor
      // naavega a la ruta amb el titul com a parametre
      if(title){
        this.router.navigate(['/articles/search', title.toLowerCase()]); //navigate cambia el valor de la url y carga el componente asociado a esta /articles/:id
        this.busqueda.reset();
      }
  }
}
