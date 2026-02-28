import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntriesComponent } from './entries/entries.component';
import { EntryDetailComponent } from './entry-detail/entry-detail.component';
import { AddEntryComponent } from './pages/add-entry/add-entry.component';


const routes: Routes = [
  { path: '', component: EntriesComponent },
  { path: 'entries/:id', component: EntryDetailComponent },
  { path: 'add-entry', component: AddEntryComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
