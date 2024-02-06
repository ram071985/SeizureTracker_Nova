import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Observable, throwError } from 'rxjs';
import { MainForm } from 'src/models/mainForm.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, NgForm, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeizureReturn } from 'src/models/seizureReturn.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-quick-log',
  templateUrl: './quick-log.component.html',
  styleUrls: ['./quick-log.component.scss']
})
export class QuickLogComponent {
  form: FormGroup;
  message: string = "";
  endpoint = '';
  submitted: boolean = false;
  submitting: boolean = false;

  constructor(private httpClient: HttpClient, private builder: FormBuilder, private snackBar: MatSnackBar) {
    this.createSeizureForm();
  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  get notes() { return this.form.get('notes') };
  get seizureType() { return this.form.get('seizureType') };

  createSeizureForm() {
    this.form = this.builder.group({
      createdDate: new Date,
      notes: "",
      seizureType: "QuickLog"
    })
  }

  onSubmit() {
    if (this.submitted)
      return;
    this.submitted = true;
    this.submitting = true;
    this.addSeizure().subscribe((res: {}) => {
      this.message = res != null ? 'Success! Hang in there sweetheart.. I love you.' : 'Something Went Wrong';
      this.snackBar.open(this.message, "CLOSE")
      this.form.reset();
      this.submitting = false;
    });
  }

  addSeizure(): Observable<any> {
    console.log('Your form data : ', this.form.value)
    return this.httpClient
      .post<any>(
        this.endpoint + '/seizuretracker/',
        JSON.stringify(this.form.value),
        this.httpHeader
      )
      .pipe(retry(1), catchError(this.processError));
  }

  processError(err: any) {
    let message = '';
    if (err.error instanceof ErrorEvent) {
      message = err.error.message;
    } else {
      message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
    return throwError(() => {
      message;
    });
  }
}
