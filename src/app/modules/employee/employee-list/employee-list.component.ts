import { Component, signal, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeCreateUpdateComponent } from "../employee-create-update/employee-create-update.component";
import { ToastService } from '../../../services/toast/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [SharedModule, EmployeeCreateUpdateComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: any;
  showCreateUpdateForm: boolean = false;
  selectedEmployee: any = null;

  keyword: any;

  searchForm!: FormGroup;

  columns: String[] = ['Name', 'Phone', 'Email', 'Role', 'Status', 'Actions'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.initializeSearchForm();
    this.getAll();
  }

  initializeSearchForm() {
    this.searchForm = this.fb.group({
      keyword: [null]
    });
  }

  getAll() {
    let filters = this.searchForm.value;

    if (!filters.keyword) {
      filters = {};
    }

    this.employeeService.searchWithFilter(filters).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.employees = res.data;
      },
      error: (err) => {
        console.error("Error fetching employees:", err);
      }
    });
  }

  search() {
    this.getAll();
  }

  reset() {
    this.searchForm.reset(); // Reset form
    this.getAll();           // Gọi API ngay sau khi reset
  }

  toCreateForm() {
    this.selectedEmployee = null;
    this.showCreateUpdateForm = true;
  }

  toEditForm(employee: any) {
    this.selectedEmployee = employee;
    this.showCreateUpdateForm = true;
  }

  closeForm() {
    this.showCreateUpdateForm = false;
  }

  delete(id: number) {
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.toastService.showToast('Employee deleted successfully!', 'success');
        this.getAll();
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
      }
    });
  }
}
