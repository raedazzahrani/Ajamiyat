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

@Component({
  selector: 'add-entry-form',
  templateUrl: './add-entry.component.html',
  styleUrls: ["./add-entry.component.scss"]
})

export class AddEntryComponent implements OnInit {

  form!: FormGroup;

  
  
  // Predefined values
  originOptions: string[] = ['Arabic', 'Latin', 'Greek', 'Persian'];
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
    this.setupAutocomplete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      entry_id: ['', Validators.required],
      original: [''],
      origin: ['', Validators.required],

      forms: this.fb.array([]),
      examples: this.fb.array([]),
      meanings: this.fb.array([]),
      references: this.fb.array([])
    });
  }

  private createStringControl(value = '', required = false) {
    return this.fb.control(
      value,
      required ? Validators.required : []
    );
  }

  // ---- FormArray Getters ----

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
  }

  removeMeaning(index: number): void {
    this.meaningsArray.removeAt(index);
  }

  // ---- Autocomplete ----

  private setupAutocomplete(): void {
    this.filteredOrigins$ = this.form.get('origin')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value, this.originOptions))
    );
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value?.toLowerCase() || '';
    return options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  submit(): void {
    if (this.form.invalid) return;

    console.log(this.form.value);
  }
}