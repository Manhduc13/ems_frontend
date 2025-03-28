import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeCreateUpdateComponent } from "../employee-create-update/employee-create-update.component";
import { ToastService } from '../../../services/toast/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeDetailComponent } from '../employee-detail/employee-detail.component';
import { ReportService } from '../../../services/report/report.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [SharedModule, EmployeeCreateUpdateComponent, EmployeeDetailComponent, PaginationComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: any;

  selectedEmployee: any = null;
  isCreateUpdateModalOpen = false;
  isDetailModalOpen = false;
  isDeleteModalOpen = false;
  selectedEmployeeId: number | null = null;

  isAdmin: boolean = false;

  keyword: any;
  page: number = 0;
  size: number = 5;
  pageInfo: any;

  searchForm!: FormGroup;

  columns: String[] = ['No', 'Name', 'Phone', 'Email', 'Position', 'Department', 'Status', 'Actions'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private reportService: ReportService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.initializeSearchForm();
    this.search();
    this.checkAdminRole();
  }

  checkAdminRole() {
    const role = this.storageService.getRoleFromToken();
    console.log(role);
    this.isAdmin = role.includes("ADMIN");
  }

  initializeSearchForm() {
    this.searchForm = this.fb.group({
      keyword: ['']
    });
  }

  search() {
    const keywordValue = this.searchForm.value.keyword?.trim();

    const filter = {
      keyword: keywordValue,
      page: this.page,
      size: this.size,
      sortBy: "username",
      order: "asc"
    }

    this.employeeService.searchWithFilter(filter).subscribe({
      next: (res: any) => {
        this.employees = res.data.map((employee: any) => {
          return {
            ...employee,
            processedAvatar: employee.avatar ? employee.avatar : 'https://res.cloudinary.com/ddfqvag5q/image/upload/v1742184227/default_ncpebq.png' // Gán URL trực tiếp
          };
        });

        this.pageInfo = res.page;
      },
      error: (err) => {
        this.toastService.showToast("Failed to load employees", "error");
        console.error("Error fetching employees:", err);
      }
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.search();
  }

  changePageSize(newSize: number) {
    this.size = newSize;
    this.page = 0;
    this.search();
  }

  reset() {
    this.searchForm.reset({ keyword: '' });
    this.page = 0;
    this.search();
  }

  openCreateUpdateModal(employee?: any) {
    this.selectedEmployee = employee || null;
    this.isCreateUpdateModalOpen = true;
  }

  closeCreateUpdateModal() {
    this.isCreateUpdateModalOpen = false;
    this.selectedEmployee = null;
  }

  openDetailModal(employee: any) {
    this.selectedEmployee = employee;
    this.isCreateUpdateModalOpen = false;
    this.isDetailModalOpen = true;
    console.log(this.isAdmin);
    
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
  }

  openConfirmDeleteModal(employeeId: number) {
    this.selectedEmployeeId = employeeId;
    this.isDeleteModalOpen = true;
  }

  closeConfirmDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedEmployeeId = null;
  }

  deleteEmployee() {
    if (this.selectedEmployeeId === null) return;

    this.employeeService.delete(this.selectedEmployeeId).subscribe({
      next: (res) => {
        if (res.result) {
          this.toastService.showToast("Delete employee successfully", "success");
          this.search();
        } else {
          this.toastService.showToast("Delete employee failed", "error");
        }
        this.closeConfirmDeleteModal();
      },
      error: (err) => {
        if (err.status === 400) {
          this.toastService.showToast("Cannot delete this employee because it is referenced in a project", "error");
        } else {
          this.toastService.showToast("An unexpected error occurred", "error");
        }
        this.closeConfirmDeleteModal();
      }
    });
  }

  generateReport() {
    const username = this.storageService.getUsernameFromToken();
    this.reportService.generateEmployeeReport(username).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank'); // Open PDF in new tab
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.toastService.showToast("Failed to generate report", "error");
      }
    });
  }
}
