import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule} from '@angular/material/divider';
import { MatChipsModule} from '@angular/material/chips'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  exports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule
  ]
})
export class NgMaterialModule { }
