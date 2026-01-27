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
  private router = inject(Router);
  private reportsService = inject(ReportsService);
  protected authService = inject(AuthService);
  protected report = signal<Report | null>(null); // signal reactiva
  protected solved = signal<boolean>(false);   // estado de resuelto

  constructor() {
    const id = this.route.snapshot.params['id'];
    this.loadReport(id);
  }

    //carreguem el report i comprovem si esta resolt o no (es guarda a Solved)
  private loadReport(id: string) {
    this.reportsService.getReport(id).subscribe(report => {
      this.report.set(report);
      this.solved.set(report.state === 'solved');
    });
  }






  //COMENTAR Y EXPLICAR
  onSubmit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const currentReport = this.report();
    if (!currentReport || currentReport.state === 'solved') return;

    this.reportsService.solveReport(currentReport._id).subscribe({
      next: updatedReport => {
        this.report.set(updatedReport);
        this.solved.set(true);
        console.log('Report solucionat!');
      },
      error: err => console.error('Error al resoldre el report:', err)
    })
  };
}