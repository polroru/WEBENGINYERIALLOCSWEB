import { Component, inject, signal } from '@angular/core';
import { ReportsService } from '../services/reports-service';
import { Report } from '../models/Report';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-list',
  imports: [    
    CommonModule,
    RouterModule
  ],
  templateUrl: './report-list.html',
  styleUrl: './report-list.css',
})
export class ReportList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportsService = inject(ReportsService);

  reports = signal<Report[]>([]); // array reactiu de reports
  loading = signal(true);          // para controlar parpadeo
  title: string = '';
  page = 1;
  limit = 10;
  total = 0;

  constructor() {
    this.loadReports();
  }

  openArticle(id: string){
    this.router.navigate(['reports/expand', id]);
  }

  loadReports() {
    this.loading.set(true); // inici de carrega
    this.reportsService.getAllReports(this.page, this.limit).subscribe(res => {
      this.reports.set(res.reports);
      this.total = res.total;
      this.loading.set(false); // carrega completada
    });
  }

  nextPage() {
    if (this.page * this.limit >= this.total) return;
    this.page++;
    this.loadReports();
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    this.loadReports();
  }

  trackById(index: number, report: Report) {
    return report._id;
  }
}

