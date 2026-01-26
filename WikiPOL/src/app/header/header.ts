import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/authservice';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected authService = inject(AuthService);
  private router = inject(Router);
  onSubmit(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/sign-in']); // redirigx al login
    }else{
      this.router.navigate(['/articles/create']);
    }
  }


  onSubmitFav(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/sign-in']); // redirigx al login
    }else{
      this.router.navigate(['/articles/fav']);
    }
  }


    //FALTA COMPROVAR QUE L'USUARI ES ADMIN

  onSubmitReport(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/sign-in']); // redirigx al login
    }else{
      this.router.navigate(['/articles/fav']);
    }
  }


}
