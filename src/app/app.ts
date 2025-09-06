import { Component, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
