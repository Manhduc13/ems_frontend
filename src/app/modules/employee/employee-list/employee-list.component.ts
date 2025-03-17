import { Component, signal, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeCreateUpdateComponent } from "../employee-create-update/employee-create-update.component";
import { ToastService } from '../../../services/toast/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter } from 'rxjs';
import { EmployeeDetailComponent } from '../employee-detail/employee-detail.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [SharedModule, EmployeeCreateUpdateComponent, EmployeeDetailComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: any;
  showCreateUpdateForm: boolean = false;
  showDetailPage: boolean = false;
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
        this.employees = res.data.map((employee: any) => {
          return {
            ...employee,
            processedAvatar: employee.avatar ? employee.avatar : 'https://res.cloudinary.com/ddfqvag5q/image/upload/v1742184227/default_ncpebq.png' // Gán URL trực tiếp
          };
        });
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
    this.searchForm.reset(); 
    this.getAll();         
  }

  viewDetail(employee: any) {
    this.selectedEmployee = employee;
    this.showCreateUpdateForm = false;
    this.showDetailPage = true;
  }

  closeDetailPage() {
    this.showDetailPage = false;
  }

  toCreateForm() {
    this.selectedEmployee = null;
    this.showDetailPage = false;
    this.showCreateUpdateForm = true;
  }

  toEditForm(employee: any) {
    this.selectedEmployee = employee;
    this.showDetailPage = false;
    this.showCreateUpdateForm = true;
  }

  closeForm() {
    this.showCreateUpdateForm = false;
  }

  delete(id: number) {
    this.employeeService.delete(id).subscribe((res) => {
      if(res.delete) {
        this.toastService.showToast("Delete employee successfully", "success");
        this.getAll();
      } else {
        this.toastService.showToast("Delete employee failed", "error");
      }
    });
  }
}
