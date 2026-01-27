import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../models/Report';
import { AuthService } from './authservice';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http = inject(HttpClient);
  private url = "http://localhost:3000";
  private authService = inject(AuthService);


    //http functions

    //funcio per agafar un report mitjançant un id

  getReport(id: string): Observable<Report>{
    console.log("Vaig a agafar report");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });
    return this.http.get<Report>(`${this.url}/report/${id.toLowerCase()}`, { headers });
  }

    //funcio per a afegir (post) un report
    //com a moltes altres funcions, retorno l'objecte editat, pero realment no el necessitem

  addNewReport(reportData: Partial<Report>): Observable<Report>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });
    const body = {reportData};
    return this.http.post<Report>(`${this.url}/report/addreport`, body, { headers });
  }


    //funcio per a fer que un report estigui solucionat (borrar en un futur)
  solveReport(id: string): Observable<Report>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });
    return this.http.patch<Report>(`${this.url}/report/solvereport/${id}`, {/*body buit, pero s'ha de posar*/}, { headers });
  }


    //funcio per agafar tots els reports (PAGINACIO)

    //page: number = 1 valor per defecte 1
  getAllReports(page: number = 1, limit: number = 10): Observable<{ reports: Report[], total: number, pagina: number, limit: number }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}`
    });

      //enviem la pagina actual i el limit d'articles que posem per pagina
    const params = { page: page.toString(), limit: limit.toString() };

      //retornem l'array amb els reports, pero a part, tambe el numero de pagina, el total d'articles que hi ha, el limit que hem imposat(tot i que no fa falta)
    return this.http.get<{ reports: Report[], total: number, pagina: number, limit: number }>(
      `${this.url}/report/all`, { headers, params }
    );
  }

}
