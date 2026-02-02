import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bug } from '../models/Bug';
import { BugsService } from '../services/bugs-service';
@Component({
  selector: 'app-bug-list',
  imports: [],
  templateUrl: './bug-list.html',
  styleUrl: './bug-list.css',
})
export class BugList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bugsService = inject(BugsService);
  bugs = signal<Bug[]>([]);



   status: string | undefined = undefined; 
   ordenarData: string | undefined = undefined; 
   ordenarSeverity: string | undefined = undefined;


  constructor(){
      this.loadBugs();
    };

    loadBugs(){
      this.bugsService.getAllBugs(this.status, this.ordenarSeverity, this.ordenarData).subscribe(allBugs =>{
        console.log("comprovo que arriben els bugs");
        this.bugs.set(allBugs);
      });
    }



   filtrarStatus(value: string) { this.status = value || undefined; this.loadBugs(); } 
   filtrarData(value: string) { this.ordenarData = value || undefined; this.loadBugs(); } 
   filtrarSeveritat(value: string) { this.ordenarSeverity = value || undefined; this.loadBugs(); }


  openBug(id: string){
    this.router.navigate(['/bug-reports', id]); //entro a la vista singular del bug
  }



}
