import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SeizureReturn } from 'src/models/seizureReturn.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MainForm } from 'src/models/mainForm.model';
import { TotalSeizureDataSet } from 'src/models/totalSeizureDataSet.model';

@Component({
    selector: 'app-total-seizures-year',
    templateUrl: './total-seizures-year.component.html',
    styleUrls: ['./total-seizures-year.component.scss']
})
export class TotalSeizuresYear implements OnInit {
    endpoint: string = '';
    loading: boolean;
    seizureRecords: MainForm[];
    totalSeizureDataSet: TotalSeizureDataSet[];
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
        this.getRecords().subscribe((res: TotalSeizureDataSet[]) => {
            this.loading = false;

            this.totalSeizureDataSet = res;

            this.getMonths();
            this.getSeizureCounts();
            console.log(this.lineChartData.labels)
        });
    }


    getRecords(): Observable<TotalSeizureDataSet[]> {
        this.loading = true;
        return this.httpClient
            .get<any>(
                this.endpoint + '/seizuretracker/data/total_seizures_current_year',
                this.httpHeader
            )
            .pipe(retry(1), catchError(err => { throw 'The query failed. Details: ' + err }));
    }

    getMonths() {

        this.lineChartData.labels = this.totalSeizureDataSet.map((x) => x.date);
        this.chart?.update();
        console.log("lables", this.totalSeizureDataSet);
    }

    getSeizureCounts() {
        this.lineChartData.datasets[0].data = this.totalSeizureDataSet.map((x) => x.amount);
        let year = new Date().getFullYear();
        this.lineChartData.datasets[0].label = `Total Daily Seizures in ${year}`;
        this.chart?.update();

        console.log("counts", this.totalSeizureDataSet[0].date);
    }
}