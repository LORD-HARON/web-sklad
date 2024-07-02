import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StillageService {

    private _subject = new Subject<any>();
    private _subject_click = new Subject<any>();

    delEvent(event: any) {
        this._subject.next(event);
    }

    clickEvent(event: any) {
        this._subject_click.next(event);
    }

    get events$() {
        return this._subject.asObservable();
    }

    get events_click$() {
        return this._subject_click.asObservable();
    }
}