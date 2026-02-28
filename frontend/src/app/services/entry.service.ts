import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entry } from '../models/entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiUrl = 'http://localhost:3000/api/entries';

  constructor(private http: HttpClient) {}

  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiUrl);
  }

  getEntryById(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiUrl}/${id}`);
  }
}
