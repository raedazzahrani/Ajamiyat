import { Component } from '@angular/core';
import { EntryService } from '../services/entry.service';
import { Entry } from '../models/entry.model';
import { FLAGS } from '../flags';



@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent {

  entries: Entry[] = [];
  filteredEntries: Entry[] = [];

  categories: string[] = [];
  languages: string[] = [];
  sources: string[] = [];

  selectedCategories: Set<string> = new Set();
  selectedLanguages: Set<string> = new Set();
  selectedSources: Set<string> = new Set();
  
  FLAGS = FLAGS; // make available in template

  mobileView = false;

  constructor(private entryService: EntryService) {
    this.loadEntries();
  }

  loadEntries() {
    this.entryService.getEntries().subscribe(entries => {
      this.entries = entries;
      this.filteredEntries = [...entries];

      // extract unique categories & languages
      this.categories = Array.from(new Set(entries.flatMap(e => e.categories || [])));
      this.sources = Array.from(new Set(entries.flatMap(e => e.sources || [])));
      this.languages = Array.from(new Set(entries.map(e => e.origin)));
    });
  }

  toggleCategory(category: string) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.applyFilters();
  }

  toggleLanguage(language: string) {
    if (this.selectedLanguages.has(language)) {
      this.selectedLanguages.delete(language);
    } else {
      this.selectedLanguages.add(language);
    }
    this.applyFilters();
  
  }

  toggleSource(source: string) {
    if (this.selectedSources.has(source)) {
      this.selectedSources.delete(source);
    } else {
      this.selectedSources.add(source);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategories.clear();
    this.selectedLanguages.clear();
    this.selectedSources.clear();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEntries = this.entries.filter(entry => {
      const categoryMatch = this.selectedCategories.size === 0 
        || (entry.categories || []).some(c => this.selectedCategories.has(c));
      const languageMatch = this.selectedLanguages.size === 0 
        || this.selectedLanguages.has(entry.origin);
      const sourceMatch = this.selectedSources.size === 0 
        || (entry.sources || []).some(c => this.selectedSources.has(c));
      return categoryMatch && languageMatch && sourceMatch;
    });
  }

  getOtherForms(entry: Entry){
    return entry.forms.filter(e => e!= entry.entry_id);
  }

  openFilters() {
    this.mobileView = !this.mobileView;
  }
}
