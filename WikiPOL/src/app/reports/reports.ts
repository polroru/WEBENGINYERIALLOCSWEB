import { Component, inject, signal } from '@angular/core';
import { ReportsService } from '../services/reports-service';
import { Report } from '../models/Report';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authservice';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class Reports {

  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private reportsService = inject(ReportsService);
  protected authService = inject(AuthService);
  protected report = signal<Report | null>(null); // signal reactiva
  protected solved = signal<boolean>(false);   // estado de resuelto
  protected loading = signal(true);

  constructor() {
    const id = this.route.snapshot.params['id'];
    this.loadReport(id);
  }

    //carreguem el report i comprovem si esta resolt o no (es guarda a Solved)
  private loadReport(id: string) {
    this.loading.set(true);
    this.reportsService.getReport(id).subscribe({
      next: report => {
        this.report.set(report);
        this.solved.set(report.state === 'solved'); //mirem si esta solved o no
        this.loading.set(false); // si carrega correctament es cambia estat a false (no carregar)
      },
      error: () => {
        this.report.set(null);
        this.loading.set(false);
      }
    });
  }



    //aquesta funcio, comunica amb el backend, si es decideix eliminar article, fa solved de totes les peticions per eliminar un article, en cas contrari, no elimina
    //funcio quan premem boto, aquest permet enviar un string (es tracta com boolean)
  onSolve(deleteArticle: boolean) {
      //sign in si no esta logged in
    if (!this.authService.isLoggedIn() || this.authService.currentUser()?.rol !== 'admin') { //en cas de no estar logejat i ser admin
      this.router.navigate(['/sign-in']);
      return;
    }

    const currentReport = this.report(); //s'agafa el report
    if (!currentReport || currentReport.state === 'solved') return; //es comprova que no estigui buit o que no estigui solucionat (solved)

      //enviem el id del report i si es vol eliminar o no
    this.reportsService.solveReport(currentReport._id, deleteArticle).subscribe({
      next: updatedReport => {
        this.report.set(updatedReport); //agafem la solucio del report
        this.solved.set(true); //posem que ja esta solved
        console.log('Report solucionat!');
      },
      error: err => console.error('Error al resoldre el report:', err)
    });
  }
}