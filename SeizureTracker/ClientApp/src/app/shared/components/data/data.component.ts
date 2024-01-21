import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss']
})
export class DataComponent {
    graphComponent: string = "";
    totalSeizuresCurrentYear: string = "Daily Seizure Count - Current Year";
    totalSeizuresByMonth: string = "Daily Seizure Count - By Month";
}