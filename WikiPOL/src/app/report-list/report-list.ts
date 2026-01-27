import { Component, inject, signal } from '@angular/core';
import { ReportsService } from '../services/reports-service';
import { Report } from '../models/Report';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  imports: [],
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
      this.loading.set(false); // carga completada
    });
  }

    //funcio per passar de pagina ( en cas de que no estiguem al limit )
  nextPage() {
    if (this.page * this.limit >= this.total) return; //en el cas de que ja no hi hagui mes reports per comprovar, no deixa augmentar pagina (pagina * nºreports per pagina >=  reports totals)
    this.page++;
    this.loadReports();
  }
    //funcio per retrocedir pagina, en cas de ser 1 o menor, no deixa
  prevPage() {
    if (this.page <= 1) return;
    this.page--;
    this.loadReports();
  }
   
}

