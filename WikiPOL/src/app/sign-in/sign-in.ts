import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/authservice';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})

export class SignIn {

  private authService = inject(AuthService);
  private router = inject(Router);


signInForm = new FormGroup({
  email: new FormControl('', {
    validators: [Validators.required, Validators.email], // obligatori + format mail
    nonNullable: true
  }),
  password: new FormControl('', {
    validators: Validators.required, // obligatori
    nonNullable: true
  })
});

  onSubmit() {
    if (this.signInForm.valid) {
      console.log('Datos del login:', this.signInForm.value);
      this.authService.signIn(this.signInForm.value).subscribe(res => { //observable para la comunicacion http, con el objeto article
        this.authService.currentUser.set(res.user.username); //set en el objeto article (signal)
        this.authService.userToken = res.token; //per utilitzar el token mentres navego
        localStorage.setItem('userToken', res.token); //per mantenir el token tot i recarregar pagina o tancar pagina
        this.router.navigate(['/']);

      });
    } else {

      console.log('Formulari no valid');
      this.signInForm.markAllAsTouched(); // Per mostrar errors
    }
  }


}
