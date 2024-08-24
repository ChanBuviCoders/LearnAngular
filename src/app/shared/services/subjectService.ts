import { Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { Getsession } from "src/app/models/getsession.model";

@Injectable({ providedIn: "root" })
export class SubjectService {
    constructor() { }
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();
    private currentUserDetails = new BehaviorSubject<Getsession>({} as Getsession);
    public currentuserSubject = this.currentUserDetails.asObservable();

    setIsAuthenticated(value) {
        this.isAuthenticatedSubject.next(value);
    }
    setCurrentUser(value) {
        this.currentUserDetails.next(value);
    }
}