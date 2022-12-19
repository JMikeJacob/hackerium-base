import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { OptionsService } from '../services/options.service'
import { FormControl, FormArray, FormGroup } from '@angular/forms'
@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {
  @Input() filters: any
  @Output() filterEvent = new EventEmitter<any>()
  levels: any[]
  types: any[]
  fields: any[]

  filterForm: FormGroup
  level_filters: FormArray
  type_filters: FormArray
  field_filters: FormArray
  field_count: number

  checkAllFields: boolean

  displayLevels: string[]
  displayTypes: string[]
  displayFields: string[]

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
    this.displayLevels = []
    this.displayTypes = []
    this.displayFields = []
    this.field_count = 0
    this.levels = []
    this.types = []
    this.fields = []
    this.optionsService.loadData().subscribe(
      res => {
        console.log("!!!")
        console.log(res)
        console.log("!!!")

        this.levels = res.data.levels
        this.types = res.data.types
        console.error(this.types)
        this.fields = res.data.fields
        this.level_filters = new FormArray([])
        this.type_filters = new FormArray([])
        this.field_filters = new FormArray([])
        this.levels.forEach((tag) => {
          this.level_filters.push(new FormControl(''))
        })
        this.types.forEach((tag) => {
          this.type_filters.push(new FormControl(''))
        })
        this.fields.forEach((tag) => {
          this.field_filters.push(new FormControl(''))
          this.field_count++
          console.log(this.field_count)
        })
        this.filterForm = new FormGroup({
          'level_filters': this.level_filters,
          'type_filters': this.type_filters,
          'field_filters': this.field_filters
        })
        this.applyVals()
      }, err => console.error(err)
    )  
  }

  checkValueLevel(event) {
    const index = +event.target.name.split('_')[1]
    console.log(this.level_filters.controls[index].value)
    if(this.level_filters.controls[index].value) {
      this.displayLevels[index] = this.levels[index]
    }
    else {
      this.displayLevels[index] = ""
    }
  }

  removeLevel(index: number) {
    console.log(index)
    this.displayLevels[index] = ""
    this.level_filters.controls[index].setValue('')
    console.log(this.displayLevels)
  }

  changeAllLevels() {
    this.level_filters.reset()
    this.displayLevels = []
  }

  checkValueType(event) {
    const index = +event.target.name.split('_')[1]
    console.log(this.type_filters.controls[index].value)
    if(this.type_filters.controls[index].value) {
      this.displayTypes[index] = this.types[index]
    }
    else {
      this.displayTypes[index] = ""
    }
  }

  removeType(index: number) {
    console.log(index)
    this.displayTypes[index] = ""
    this.type_filters.controls[index].setValue('')
  }

  changeAllTypes() {
    this.type_filters.reset()
    this.displayTypes = []
  }

  checkValueField(event) {
    console.log(event.target.name.split('_')[1])
    const index = +event.target.name.split('_')[1]
    console.log(this.field_filters.controls[index].value)
    if(this.field_filters.controls[index].value) {
      this.displayFields[index] = this.fields[index]
    }
    else {
      this.displayFields[index] = ""
    }
  }

  removeField(index: number) {
    this.displayFields[index] = ""
    this.field_filters.controls[index].setValue('')
  }

  changeAllFields() {
    this.field_filters.reset()
    this.displayFields = []
  }

  applyVals() {
    if(this.filters) {
      if(this.filters.l) {
        this.filters.l.forEach((res) => {
          const index = this.levels.indexOf(res)
          this.level_filters.controls[index].setValue('true')
          this.displayLevels[index] = this.levels[index]
        })
      }
      if(this.filters.t) {
        this.filters.t.forEach((res) => {
          const index = this.types.indexOf(res)
          this.type_filters.controls[index].setValue('true')
          this.displayTypes[index] = this.types[index]
        })
      }
      if(this.filters.f) {
        this.filters.f.forEach((res) => {
          const index = this.fields.indexOf(res)
          this.field_filters.controls[index].setValue('true')
          this.displayFields[index] = this.fields[index]
        })
      }
    }
  }

  onSubmit() {
    let levels = []
    let types = []
    let fields = []
    for(let i = 0; i < this.level_filters.value.length; i++) {
      if(this.level_filters.value[i]) {
        levels.push(this.levels[i])
      }
    }
    for(let i = 0; i < this.type_filters.value.length; i++) {
      if(this.type_filters.value[i]) {
        types.push(this.types[i])
      }
    }
    for(let i = 0; i < this.field_filters.value.length; i++) {
      if(this.field_filters.value[i]) {
        fields.push(this.fields[i])
      }
    }
    if(levels.length === this.levels.length) levels = []
    if(types.length === this.types.length) types = []
    if(fields.length === this.fields.length) fields = []
    console.log({levels: levels, types: types, fields: fields})
    this.filterEvent.emit({levels: levels, types: types, fields: fields})
  }
}
