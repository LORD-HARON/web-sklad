import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskCommonService {

    constructor() { }

    private _subject = new Subject<any>();
    private _subject_update = new Subject<any>();

    clearEvent(event: any) {
        this._subject.next(event);
    }

    get events$() {
        return this._subject.asObservable();
    }

    updateEvent(event: any) {
        this._subject_update.next(event);
    }

    get events_update$() {
        return this._subject_update.asObservable();
    }
}
