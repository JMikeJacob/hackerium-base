import { Directive } from '@angular/core'
import { FormArray, FormControl } from '@angular/forms'

@Directive({
  selector: '[appDuplicateValidator]'
})
export class DuplicateValidatorDirective {

  constructor() { }
  
  duplicateValidator() {
    return (form: FormArray): {[key:string]: any} | null => {
      // console.log(form.length)
      if(form.length > 1) {
        let counts = []
        for(let i = 0; i < form.length; i++) {
          if(!counts[form.controls[i].value]) {
            counts[form.controls[i].value] = 1
          }
          else {
            return {'duplicateValue': {value: form.controls[i].value}}
          }
        }
      }
      return null
    }
  }

  fileValidator(extensions: string[]) {
    return (c: FormControl): {[key:string]: any} | null => {
      console.log(c.value)
      if(c.value) {
        const ext = c.value.split('.')[c.value.split('.').length-1]
        if(!extensions.includes(ext)) {
          return {'invalidFormat': {value: c.value}}
        }
      }
      return null
    }
  }

}
