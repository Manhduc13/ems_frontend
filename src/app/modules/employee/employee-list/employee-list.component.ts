import { Component, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeCreateUpdateComponent } from "../employee-create-update/employee-create-update.component";
import { ToastService } from '../../../services/toast/toast.service';

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

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.employeeService.getAll().subscribe((data: any) => {
      this.employees = data;
    });
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
