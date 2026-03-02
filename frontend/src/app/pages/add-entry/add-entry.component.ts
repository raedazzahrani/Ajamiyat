import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { Entry } from 'src/app/models/entry.model';
import { EntryService } from 'src/app/services/entry.service';
import { noWhitespaceValidator } from 'src/utils/validation';


@Component({
  selector: 'add-entry-form',
  templateUrl: './add-entry.component.html',
  styleUrls: ["./add-entry.component.css"]
})

export class AddEntryComponent implements OnInit {

  form!: FormGroup;

  
  
  // Predefined values
  otherOriginOption = 'لغة أخرى';
  originOptions: string[] = ['Arabic', 'Latin', 'Greek', 'Persian', 'Turkish', 'French', 'English'].concat(this.otherOriginOption);
  

  referenceOptions: string[] = ['Quran', 'Hadith', 'Poetry', 'Dictionary of X'];
  
  filteredOrigins$!: Observable<string[]>;
  filteredReferences$!: Observable<string[]>;
  exampleEntry : Entry = {
    submission_id: null,
    entry_id: "برضه",
    origin: 'التركية',
    original: "bir de",
    submitted_at: null,
    approved_at: null,
    categories: ["العامية"],
    examples: ["أنا مش هقدر أخلص الشغل بسرعة، بس أنت برضه حاول تساعدني",
  "الكتب دي جديدة، وبرضه عندي كتب قديمة إذا عايز يعني"],
    forms: ["برضو", "برضة"],
    meanings: ["أيضًا", "كذلك"],
    sources: []
};;
  
  constructor(private fb: FormBuilder, private entryService: EntryService){
    this.entryService.getEntryById("برضةو").subscribe(entry => {
      this.exampleEntry = entry
    });
  }


  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      entry_id: this.createStringControl('', true),
      original: [''],
      originSelect: this.createStringControl('', true),
      origin: this.createStringControl('', true),
      forms: this.fb.array([]),
      examples: this.fb.array([]),
      meanings: this.fb.array([]),
      references: this.fb.array([])
    });

    this.form.get('originSelect')?.valueChanges.subscribe(value => {
      if (value === this.otherOriginOption) {
        this.form.get('origin')?.setValidators(this.createStringControl('', true).validator);
      } else {
        this.form.get('origin')?.clearValidators();
      }

      this.form.get('origin')?.updateValueAndValidity();
    });
  }

  private createStringControl(value = '', required = false) {
    let validators = [noWhitespaceValidator];
    if (required) validators.push(Validators.required);
    return this.fb.control(
      value,
      validators
    );
  }

  // ---- FormArray Getters ----

  get showOtherOriginInputField() {
    return this.form.get('originSelect')?.value === this.otherOriginOption;
  }

  get formsArray(): FormArray {
    return this.form.get('forms') as FormArray;
  }

  get examplesArray(): FormArray {
    return this.form.get('examples') as FormArray;
  }

  get referencesArray(): FormArray {
    return this.form.get('references') as FormArray;
  }

  get meaningsArray(): FormArray{
    return this.form.get("meanings") as FormArray;
  }
  // ---- Add / Remove Methods ----

  addForm(): void {
    this.formsArray.push(this.createStringControl());
    console.log(this.form.value);
  }

  removeForm(index: number): void {
    this.formsArray.removeAt(index);
  }

  addExample(): void {
    this.examplesArray.push(this.createStringControl());
  }

  removeExample(index: number): void {
    this.examplesArray.removeAt(index);
  }

  addReference(value = ''): void {
    this.referencesArray.push(this.createStringControl(value));
  }

  removeReference(index: number): void {
    this.referencesArray.removeAt(index);
  }

  addMeaning(value = ''): void {
    this.meaningsArray.push(this.createStringControl(value));
    console.log(this.form.value);
  }

  removeMeaning(index: number): void {
    this.meaningsArray.removeAt(index);
  }

  

  submit(): void {
    if (this.form.invalid) return;

    console.log(this.form.value);
  }
}