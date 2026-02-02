import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bug } from '../models/Bug';
import { AuthService } from './authservice';


@Injectable({
  providedIn: 'root',
})
export class BugsService {

  private http = inject(HttpClient);
  private url = "http://localhost:3000";
  private authService = inject(AuthService);
  
    //pasar status, ordenarData, ordenarSeveritat per filtrar
  getAllBugs(status?: string, ordenarData?: string, ordenarSeveritat?: string): Observable<Bug[]>{
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });

      //nomes s'han d'incloure aquells headers que existeixin
    const params: any = {};
    if (status != null) { params.status = status;}
    if (ordenarData != null) {params.ordenarData = ordenarData;}
    if (ordenarSeveritat != null) {params.ordenarSeveritat = ordenarSeveritat;}

    return this.http.get<Bug[]>(`${this.url}/bugs/getall`, { headers, params });
  }

    //pasar id del bug
  getBug(id: string): Observable<Bug>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });
        return this.http.get<Bug>(`${this.url}/bugs/${id}`, { headers });
  }

    //pasar bug (nou)
  addBug(bug: Partial <Bug>): Observable<Bug>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}` //authorization es un metadato, tiene este nombre por defecto
    });
    
    const body = bug;

    return  this.http.post<Bug>(`${this.url}/bugs/postbug`, body, { headers });
  }

    //pasar status (string), additional_comments (string), id (string)
    //el additional comments ha de pasar tambe els comentaris anteriors (per estalviar feina per ara al backend)
  editBug(status: string, additional_comments: string[], id: string): Observable<Bug>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.userToken || ''}`
    });    
    
    const body = { status, additional_comments};

    return this.http.patch<Bug>(`${this.url}/bugs/update/${id}`, body, { headers });
  }



  
}
