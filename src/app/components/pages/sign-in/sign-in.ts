import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SigninService } from '../../../services/signin.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // 👈 import ActivatedRoute
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css'],
})
export class SignIn {
  private signinService = inject(SigninService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // 👈 para leer queryParams
  private toast = inject(ToastrService);

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });

  handleSubmit() {
    if (!this.loginForm.valid) {
      this.toast.warning('Todos los campos son obligatorios');
      return;
    }

    const data = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.signinService.loginUser(data).subscribe({
      next: (res: any) => {
        // guardar token como antes ...
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }

        const user = this.signinService.getUser();

        let redirect = this.route.snapshot.queryParamMap.get('redirect');

        if (user?.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (user?.role === 'user') {
          if (redirect) {
            this.router.navigate([`/${redirect}`]); 
          } else {
            this.router.navigate(['/user/dashboard']);
          }
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al iniciar sesión');
      },
    });
  }
}
