import { Directive } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Directive({
  selector: '[appEstablishmentValidator]'
})
export class EstablishmentValidatorDirective {

  constructor() { }

  establishmentValidator() {
    return (control: AbstractControl): {[key:string]: any} | null => {
      if(!control.value) return null
      const invalid = new Date(control.value) > new Date()
      return invalid ? {'invalidDate': {value: control.value}} : null
    }
  }
    

}

