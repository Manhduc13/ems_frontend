import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProjectCreateUpdateComponent } from '../project-create-update/project-create-update.component';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { ProjectService } from '../../../services/project/project.service';
import { ToastService } from '../../../services/toast/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../../services/report/report.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [SharedModule, ProjectCreateUpdateComponent, ProjectDetailComponent, PaginationComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {
  projects: any;

  searchForm!: FormGroup;

  selectedProject: any;
  isCreateUpdateModalOpen = false;
  isDetailModalOpen = false;
  isDeleteModalOpen = false;
  selectedProjectId: number | null = null;

  isManager: boolean = false;

  keyword: any;
  page: number = 0;
  size: number = 5;
  pageInfo: any;

  columns: String[] = ['No', 'Name', 'Start Date', 'Budget', 'Status', 'Actions'];

  constructor(
    private projectService: ProjectService,
    private storageService: StorageService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.search();
    this.checkManagerRole();
  }

  checkManagerRole() {
    const role = this.storageService.getRoleFromToken();
    console.log(role);
    this.isManager = role.includes("MANAGER")
  }

  initializeForm() {
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
      sortBy: "name",
      order: "asc"
    }

    this.projectService.searchWithFilter(filter).subscribe({
      next: (res: any) => {
        this.projects = res.data;
        this.pageInfo = res.page;
      },
      error: (err) => {
        this.toastService.showToast("Failed to load projects", "error");
        console.log(err);
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

  generateReport() {
    const username = this.storageService.getUsernameFromToken();
    this.reportService.generateProjectReport(username).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.toastService.showToast("Failed to generate report", "error");
      }
    });
  }

  reset() {
    this.searchForm.reset({ keyword: '' });
    this.page = 0;
    this.search();
  }

  openCreateUpdateModal(project?: any) {
    this.selectedProject = project || null;
    this.isCreateUpdateModalOpen = true;
  }

  closeCreateUpdateModal() {
    this.isCreateUpdateModalOpen = false;
    this.selectedProject = null;
  }


  openDetailModal(project: any) {
    this.selectedProject = project;
    this.isCreateUpdateModalOpen = false;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
  }

  openConfirmDeleteModal(employeeId: number) {
    this.selectedProjectId = employeeId;
    this.isDeleteModalOpen = true;
  }

  closeConfirmDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedProjectId = null;
  }

  deleteEmployee() {
    if (this.selectedProjectId === null) return;

    this.projectService.delete(this.selectedProjectId).subscribe({
      next: (res) => {
        if (res.result) {
          this.toastService.showToast("Delete project successfully", "success");
          this.search();
        } else {
          this.toastService.showToast("Delete project failed", "error");
        }
        this.closeConfirmDeleteModal();
      },
      error: (err) => {
        if (err.status === 400) {
          this.toastService.showToast("Cannot delete this project because it is referenced in an employee", "error");
        } else {
          this.toastService.showToast("An unexpected error occurred", "error");
        }
        this.closeConfirmDeleteModal();
      }
    });
  }
}
