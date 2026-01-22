import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/authservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {

  private authService = inject(AuthService);
  private router = inject(Router);


  signUpForm = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true
    })
  });

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Dades del registre', this.signUpForm.value);
      this.authService.signUp(this.signUpForm.value).subscribe(res => {
        this.authService.currentUser.set(res.user); //guardo usuari
        this.authService.userToken = res.token;
        localStorage.setItem('userToken', res.token);
        console.log('Signup correcte, token guardat');
        this.router.navigate(['/']);
      });
    } else {
      console.log('Formulari no valid');
      this.signUpForm.markAllAsTouched();
    }
  }
}
