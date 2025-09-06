import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { SigninService } from '../../../services/signin.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})
export class SignUp {
  private signinService = inject(SigninService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  registerForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  handleRegister() {
    if (this.registerForm.valid) {
      const data = {
        name: this.registerForm.value.name!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        role: 'user',
      };

      this.signinService.registerUser(data).subscribe({
        next: (res: any) => {
          this.toast.success(res.message || 'Registro exitoso');
          this.router.navigate(['/sign-in']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Error al registrarse');
        }
      });
    } else {
      this.toast.warning('Por favor, completa todos los campos correctamente');
    }
  }
}
