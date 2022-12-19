import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';

// @Directive({
//   selector: '[appContactValidator]'
// })
export function dateValidator() {
  return (control: AbstractControl): {[key:string]: any} | null => {
    if(!control.value) return null
    const invalid = new Date(control.value) < new Date()
    return invalid ? {'invalidDate': {value: control.value}} : null
  }
}