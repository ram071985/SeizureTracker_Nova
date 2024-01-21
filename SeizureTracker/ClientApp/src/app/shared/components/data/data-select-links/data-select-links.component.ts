import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-data-select-links',
    templateUrl: './data-select-links.component.html',
    styleUrls: ['./data-select-links.component.scss']
})
export class DataSelectLinks {
    @Input() dailySeizureCountCurrentYear: string = "";
    @Output() dailySeizureCountCurrentYearChange = new EventEmitter<string>();
    @Input() dailySeizureCountMonths: string = "";
    @Output() dailySeizureCountMonthsChange = new EventEmitter<string>();

    toggle(selection) {
        this.dailySeizureCountCurrentYearChange.emit(selection);
        console.log(selection);
    }
}