import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Getsession, userAccount } from "src/app/models/getsession.model";

@Injectable({ providedIn: "root" })
export class SubjectService {
    userAccount: userAccount;
    constructor() {
        this.currentuserSubject.subscribe((value: Getsession) => { this.userAccount = value.data })
    }
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
    get currentUser(): userAccount {
        return this.userAccount;
    }
}