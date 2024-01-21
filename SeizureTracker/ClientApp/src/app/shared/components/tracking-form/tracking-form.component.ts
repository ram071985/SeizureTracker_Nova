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

export enum MedicationChange {
  Yes = 1,
  No = 0
}

@Component({
  selector: 'app-tracking-form',
  templateUrl: './tracking-form.component.html',
  styleUrls: ['./tracking-form.component.scss']
})
export class TrackingFormComponent implements OnInit {
  form: FormGroup;
  mainForm: MainForm;
  message: string = "";
  endpoint = '';
  timeRegEx: RegExp = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
  strengthRegEx: RegExp = new RegExp('^[1-9][0-9]*$');
  decimalRegEx: RegExp = new RegExp('[0-4]');
  time: string = '';
  seizureStrengthInput: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  amPMInput: string[] = ["AM", "PM"];
  ketoneLevelsInput: string = "";
  sleepInHoursInput: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  medicationChangeInput: string[] = ["TRUE", "FALSE"];
  seizureTypeSelections: string[] = []; 
  seizureTypesInput: string[] = ["Partial", "Complex", "Musicogenic", "Smell", "Grand MAL"];
  musicArtist: string = "";
  musicSong: string = "";
  musicSongKey: string = "";
  announcer = inject(LiveAnnouncer);
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSeizureTypes: Observable<string[]>;

  @Input() toggled: "";
  @Output() toggledChange: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('seizureTypeInput') seizureTypeInput: ElementRef<HTMLInputElement>;

  constructor(private httpClient: HttpClient, private builder: FormBuilder, private snackBar: MatSnackBar) {
    this.createSeizureForm();

    this.filteredSeizureTypes = this.seizureType.valueChanges.pipe(
      startWith(null),
      map((seizure: string | null) => (seizure ? this.filterSeizureTypes(seizure) : this.seizureTypesInput.slice())),
    );
  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  ngOnInit() {
  }

  changeAmPm() {
    this.toggled = this.toggled;
    this.toggledChange.emit(this.toggled);
    console.log(this.toggled);
  }

  createSeizureForm() {
    this.form = this.builder.group({
      date: new FormControl([Validators.required]),
      timeOfSeizure: new FormControl("", this.regExValidator(this.timeRegEx)),
      seizureStrength: new FormControl(0, this.regExValidator(this.strengthRegEx)),
      medicationChange: "",
      medicationChangeExplanation: "",
      ketonesLevel: new FormControl("0", this.regExValidator(this.decimalRegEx)),
      seizureType: new FormControl("", [Validators.required]),
      sleepAmount: new FormControl(0, this.regExValidator(this.strengthRegEx)),
      amPM: new FormControl("", [Validators.required]),
      notes: ""
    })
  }

  get date() { return this.form.get('date') };
  get timeOfSeizure() { return this.form.get('timeOfSeizure') };
  get seizureStrength() { return this.form.get('seizureStrength') };
  get seizureType() { return this.form.get('seizureType') };
  get ketonesLevel() { return this.form.get('ketonesLevel') };
  get sleepAmount() { return this.form.get('sleepAmount') };
  get amPM() { return this.form.get('amPM') };
  get notes() { return this.form.get('notes') };

  regExValidator(regEx: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = regEx.test(control.value);
      return !forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  onSubmit() {
    this.addSeizure().subscribe((res: {}) => {
      this.message = res != null ? 'Record Successfully Submitted' : 'Something Went Wrong';
      this.snackBar.open(this.message, "CLOSE")
      this.form.reset();

    });
  }

  onDateEntry(event: MatDatepickerInputEvent<Date>) {
    // change to switch statement?
    this.queryKetones().subscribe((res: MainForm) => {
      if (res?.ketonesLevel == 0 || res?.ketonesLevel == null) {
        this.form.value.ketonesLevel = 0;
      }
      else {
        this.form.value.ketonesLevel = res.ketonesLevel
      }
    })
  }

  addSeizure(): Observable<any> {
    this.form.value.seizureType = this.seizureTypeSelections.toString();
    console.log('Your form data : ', this.form.value)

    return this.httpClient
      .post<any>(
        this.endpoint + '/seizuretracker',
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

  queryKetones() {
    console.log('Date Value : ', this.form.value.date)
    return this.httpClient
      .post<any>(
        this.endpoint + '/seizuretracker/check_ketones',
        JSON.stringify(this.form.value.date),
        this.httpHeader
      )
      .pipe(retry(1), catchError(this.processError));
  }

  addSeizureType(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.seizureTypeSelections.push(value);
    }

    event.chipInput!.clear();

    this.seizureType.setValue(null);
  }

  selectedSeizureType(event: MatAutocompleteSelectedEvent): void {
    this.seizureTypeSelections.push(event.option.viewValue);
    this.seizureTypeInput.nativeElement.value = '';
    this.seizureType.setValue(null);
  }

  removeSeizureType(seizureType: string): void {
    const index = this.seizureTypeSelections.indexOf(seizureType);

    if (index >= 0) {
      this.seizureTypeSelections.splice(index, 1);
      this.announcer.announce(`Removed ${seizureType}`);
    }
  }

  private filterSeizureTypes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.seizureTypesInput.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
