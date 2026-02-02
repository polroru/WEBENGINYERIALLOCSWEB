import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/authservice';
import { BugsService } from '../services/bugs-service';
import { Bug } from '../models/Bug';
import { StatusChangeEvent } from '@angular/forms';

@Component({
  selector: 'app-bug-view',
  imports: [],
  templateUrl: './bug-view.html',
  styleUrl: './bug-view.css',
})
export class BugView {

  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private bugsService = inject(BugsService);
  protected authService = inject(AuthService);
  protected bug = signal <Bug | null> (null);

  constructor() {
    const id = this.route.snapshot.params['id']; // agafem l'id de l'article de la ruta
    this.loadBug(id); // carreguem l'article
  }


  private loadBug(id: string){
    this.bugsService.getBug(id).subscribe(bug => {
        this.bug.set(bug);
      }
    )
  }

updateBug() {
  const current = this.bug();
  if (!current) return;

  const status = (document.getElementById('status') as HTMLSelectElement).value;
  const comment = (document.getElementById('comment') as HTMLTextAreaElement).value;

  // Convertir todo a string primitivo y añadir el nuevo comentario
  current.additional_comments.push(comment);

  this.bugsService.editBug(status, current.additional_comments, current._id).subscribe(updated => {
    this.bug.set(updated);
    (document.getElementById('comment') as HTMLTextAreaElement).value = '';
  });
}



}
