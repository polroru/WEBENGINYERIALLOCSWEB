import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './/header/header';
import { Footer } from './footer/footer';
import { SearchBar } from './search-bar/search-bar';
import { AuthService } from './services/authservice';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Footer,
    SearchBar,
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('WikiPOL');
}
