import { TotalSeizureDataSet } from "./totalSeizureDataSet.model";

export interface TotalSeizureMonthsReturn {
    years: number[],
    months: number[],
    dataSet: TotalSeizureDataSet[];
}