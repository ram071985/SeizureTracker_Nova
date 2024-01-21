import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Observable, throwError } from 'rxjs';
import { MainForm } from 'src/models/mainForm.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, NgForm, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { SeizureReturn } from 'src/models/seizureReturn.model';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

@Component({
    selector: 'app-record-table',
    templateUrl: './record-table.component.html',
    styleUrls: ['./record-table.component.scss']
})

export class RecordTableComponent implements OnInit {
    displayedColumns: string[] = ['time', 'seizureStrength', 'medicationChange', 'medicationChangeExplanation', 'ketonesLevel', 'seizureType', 'sleepAmount', 'notes'];
    endpoint = '';
    seizureRecords: MainForm[];
    page: number = 1;
    pageIterator = [];
    mappedRecords: { "id": string, "value": string }[];
    loading: boolean;
    panelOpenState = false;
    map = new Map<string, string>();
    expansionDateColumn = 'DATE';
    expansionCountColumn = 'SEIZURE COUNT';
    dataSource: MainForm[];

    constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private datePipe: DatePipe) {
    }

    httpHeader = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }),
    };

    ngOnInit() {
        this.loading = false;
        this.getRecords().subscribe((res: SeizureReturn) => {
            this.loading = false;
            let processPageCount = this.setPageCount(res.pageCount);

            this.pageIterator = new Array(processPageCount);
            this.seizureRecords = res.seizures;
            this.dataSource = res.seizures;
            // for(let x = 0; x < res.seizures.length; x++)
            // {
            //     for(let y = 0; y < res.seizures[x])
            //     this.dataSource.push(re.se)
            // }
            console.log('Seizure Records: ', this.seizureRecords);
        });
    }

    setPageCount(pageCount: number) {
        if (pageCount % 1 != 0) {
            return Math.floor(pageCount + 1);
        }
        return pageCount;
    }

    changePageNumber(pageNumber: number) {
        if (pageNumber < 1 || pageNumber > this.pageIterator.length) {
            return;
        }
        this.page = pageNumber;
        this.getRecords().subscribe((res: SeizureReturn) => {
            this.loading = false;
            let processPageCount = this.setPageCount(res.pageCount);
            this.pageIterator = new Array(processPageCount);
            this.seizureRecords = res.seizures;
        });
    }

    convertFromCamelCase(text: string) {
        const result = text.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult;
    }

    getRecords(): Observable<SeizureReturn> {
        this.loading = true;
        return this.httpClient
            .post<any>(
                this.endpoint + '/seizuretracker/records',
                JSON.stringify(this.page),
                this.httpHeader
            )
            .pipe(retry(1), catchError(err => { throw 'The query failed. Details: ' + err }));
    }
}