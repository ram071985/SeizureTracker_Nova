import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainForm } from 'src/models/mainForm.model';
import { DatePipe } from '@angular/common';
import { MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-expansion-item',
    templateUrl: './expansion-item.component.html',
    styleUrls: ['./expansion-item.component.scss']
})

export class ExpansionItemComponent {
    @Input() item: MainForm;
    @Input() recordNumber: number;
    displayedColumns: string[] = ['timeOfSeizure', 'seizureStrength', 'seizureType', 'medicationChange', 'medicationChangeExplanation', 'ketonesLevel', 'sleepAmount'];
    rows: string[] = ['Date', 'Time', 'Seizure Strength', 'Medication Change', 'M.C. Explanation', 'Ketones Level', 'Seizure Type', 'Sleep Amount', 'Notes'];
    dataSource: MainForm;

    constructor(datePipe: DatePipe)
    {
      
    }

    ngOnit() {
        this.dataSource = this.item;
        console.log(this.dataSource)
    }
}