import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EntryService } from '../services/entry.service';
import { Entry } from '../models/entry.model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.css']
})
export class EntryDetailComponent {

  entry$!: Observable<Entry>;

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService
  ) {}

  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.entry$ = this.entryService.getEntryById(id);
  }
}
