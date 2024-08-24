import { CanDeactivateFn } from "@angular/router";
import { CanComponentDeactivate } from "./canDeactivateInterface";

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
    return component.canDeactivate()? component.canDeactivate() : false;
  };