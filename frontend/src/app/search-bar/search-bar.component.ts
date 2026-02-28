import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  constructor(private router: Router){
    
  }
  
  searchTerm = "";
  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/'], {
        queryParams: { q: this.searchTerm }
      });
    }
  }
}
