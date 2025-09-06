import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class PerfilComponent {
  user: any = { name: '', email: '' };
  editMode = false;
  success: string | null = null;
  error: string | null = null;

  // 🔹 Estado del modal
  showConfirmModal = false;

  constructor(private userService: UserService, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (data: any) => {
        this.user = {
          name: data.name,
          email: data.email,
        };
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      error: () => {
        this.error = '❌ Error al cargar el perfil';
      },
    });
  }

  enableEdit() {
    this.editMode = true;
    this.success = null;
    this.error = null;
  }

  cancelEdit() {
    this.editMode = false;
    this.loadProfile();
  }

  // 🔹 Abrir modal
  openConfirmModal() {
    this.showConfirmModal = true;
  }

  // 🔹 Cerrar modal sin guardar
  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  // 🔹 Confirmar guardar
  confirmSave() {
    this.showConfirmModal = false;
    this.saveChanges();
  }

  saveChanges() {
    this.userService.updateProfile(this.user).subscribe({
      next: (data: any) => {
        this.user = {
          name: data.name,
          email: data.email,
        };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.success = '✅ Perfil actualizado con éxito';
        this.error = null;
        this.editMode = false;

        setTimeout(() => {
          this.router.navigate(['/user/dashboard']);
        }, 1500);
      },
      error: () => {
        this.error = '❌ Error al actualizar el perfil';
        this.success = null;
      },
    });
  }

  goBack() {
    this.router.navigate(['/user/dashboard']);
  }
}
