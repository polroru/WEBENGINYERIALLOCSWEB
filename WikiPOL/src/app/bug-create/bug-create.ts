import { Component, inject } from '@angular/core';
import { BugsService } from '../services/bugs-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-bug-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './bug-create.html',
  styleUrl: './bug-create.css',
})
export class BugCreate {

  private bugsService = inject(BugsService);
  protected succes = false;

  
bugForm = new FormGroup({
  bug_description: new FormControl('', {
    validators: Validators.required,
    nonNullable: true
  }),
  reproduction_steps: new FormControl('', {
    validators: Validators.required,
    nonNullable: true
  }),
  severity: new FormControl(1, {
    validators: Validators.required,
    nonNullable: true
  }),
  additional_comment: new FormControl('', {
    nonNullable: true
  })
});


onSubmit() {
  const form = this.bugForm.getRawValue();

  const body = {
    bug_description: form.bug_description,
    reproduction_steps: form.reproduction_steps,
    severity: form.severity,
    additional_comments: form.additional_comment ? [form.additional_comment] : []
  };

  this.bugsService.addBug(body).subscribe(response => {
    console.log("Bug creado correctamente");
  });
}

}


