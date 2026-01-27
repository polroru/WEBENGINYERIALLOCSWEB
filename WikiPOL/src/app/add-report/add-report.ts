import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticlesService } from '../services/articles-service';
import { Router } from '@angular/router';
import { AuthService } from '../services/authservice';
import { ReportsService } from '../services/reports-service';



@Component({
  selector: 'app-add-report',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-report.html',
  styleUrl: './add-report.css',
})
export class AddReport {
  private reportsService = inject(ReportsService);
}
