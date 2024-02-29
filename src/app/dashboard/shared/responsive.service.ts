import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { HostListener, Injectable } from "@angular/core";

@Injectable({providedIn:"root"})
export class responsiveService {
   
    constructor( private BreakpointObserver:BreakpointObserver){}

    getGadgets() {
      console.log('Web ' + Breakpoints.Web);
      console.log('WebLandscape ' + Breakpoints.WebLandscape);
      console.log('WebPortrait ' + Breakpoints.WebPortrait);
  
      console.log('Tablet ' + Breakpoints.Tablet);
      console.log('TabletPortrait ' + Breakpoints.TabletPortrait);
      console.log('TabletLandscape ' + Breakpoints.TabletLandscape);
  
      console.log('Handset ' + Breakpoints.Handset);
      console.log('HandsetLandscape ' + Breakpoints.HandsetLandscape);
      console.log('HandsetPortrait ' + Breakpoints.HandsetPortrait);
  
      console.log('XSmall ' + Breakpoints.XSmall);
      console.log('Small ' + Breakpoints.Small);
      console.log('Medium ' + Breakpoints.Medium);
      console.log('Large ' + Breakpoints.Large);
      console.log('XLarge ' + Breakpoints.XLarge);
     var gedgetType=0;
      this.BreakpointObserver.observe([Breakpoints.HandsetPortrait])
        .subscribe(result => {
          if (result.breakpoints[Breakpoints.HandsetPortrait]) {
            console.log("screens matches HandsetPortrait");
            gedgetType=1
          }

        })
        return gedgetType;
    }
} 