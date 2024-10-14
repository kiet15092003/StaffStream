import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import {} from '@angular/material/'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  searchTerm: string = '';

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }
}