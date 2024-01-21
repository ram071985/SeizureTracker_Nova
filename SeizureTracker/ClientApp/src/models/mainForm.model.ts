
export interface MainForm {
    id: number,
    createdDate?: Date,
    timeOfSeizure?: Date,
    seizureStrength?: number,
    ketonesLevel?: number,
    seizureType?: string,
    sleepAmount?: number,
    notes?: string,
    medicationChange?: boolean,
    medicationChangeExplanation?: string,
    amPm?: string,
    pageCount?: number,
    pageNumber?: number
}