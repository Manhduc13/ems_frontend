import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() page: number = 0;
  @Input() size: number = 5;
  @Input() totalPages: number = 1;
  @Input() totalElements: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.pageChange.emit(newPage);
    }
  }

  changePageSize(event: Event) {
    const newSize = (event.target as HTMLSelectElement).value;
    this.sizeChange.emit(Number(newSize));
  }
}
