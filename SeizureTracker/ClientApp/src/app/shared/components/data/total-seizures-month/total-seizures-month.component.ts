import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SeizureReturn } from 'src/models/seizureReturn.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MainForm } from 'src/models/mainForm.model';
import { TotalSeizureMonthsReturn } from 'src/models/totalSeizureMonthsReturn.model';

@Component({
    selector: 'app-total-seizures-month',
    templateUrl: './total-seizures-month.component.html',
    styleUrls: ['./total-seizures-month.component.scss']
})
export class TotalSeizuresMonth implements OnInit {
    years: number[];
    months: string[];
    endpoint: string = '';
    loading: boolean;
    seizureRecords: MainForm[];
    totalSeizureMonthsReturn: TotalSeizureMonthsReturn;
    monthChoices: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthLable: string[] = [];
    year: number = 0;


    lineChartData: ChartConfiguration['data'] = {
        datasets: [
            {
                data: [],
                label: '',
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                fill: 'origin',
            },
        ],
        labels: []
    };

    public lineChartType: ChartType = 'line';

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    constructor(private httpClient: HttpClient) {

    }

    httpHeader = {
        headers: new HttpHeaders({
            'Accept': 'application/json'
        }),
    };

    ngOnInit() {
        this.loading = false;
        this.getRecords().subscribe((res: TotalSeizureMonthsReturn) => {
            this.loading = false;

            this.totalSeizureMonthsReturn = res;

            if (this.totalSeizureMonthsReturn.years.length > 0) {
                this.years = this.totalSeizureMonthsReturn.years;
            }

            if (this.totalSeizureMonthsReturn.months.length > 0) {

                this.totalSeizureMonthsReturn.months.forEach(element => {
                    this.months.push(this.monthChoices[element]);
                });
            }

            // this.getMonths();
            // this.getSeizureCounts();
            console.log(this.lineChartData.labels)
        });
    }

    getRecords(): Observable<TotalSeizureMonthsReturn> {
        this.loading = true;
        return this.httpClient
            .get<any>(
                this.endpoint + '/seizuretracker/data/total_seizures_months',
                this.httpHeader
            )
            .pipe(retry(1), catchError(err => { throw 'The query failed. Details: ' + err }));
    }

    // getMonths() {
    //     this.lineChartData.labels = this.totalSeizureMonthsReturn.map((x) => x.date);
    //     this.chart?.update();
    //     console.log("lables", this.totalSeizureDataSet);
    // }

    // getSeizureCounts() {
    //     this.lineChartData.datasets[0].data = this.totalSeizureDataSet.map((x) => x.amount);
    //     let year = new Date().getFullYear();
    //     this.lineChartData.datasets[0].label = `Total Daily Seizures in ${year}`;
    //     this.chart?.update();

    //     console.log("counts", this.totalSeizureDataSet[0].date);
    // }
}