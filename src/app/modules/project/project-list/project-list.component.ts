import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProjectCreateUpdateComponent } from '../project-create-update/project-create-update.component';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { ProjectService } from '../../../services/project/project.service';
import { ToastService } from '../../../services/toast/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../../services/report/report.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [SharedModule, ProjectCreateUpdateComponent, ProjectDetailComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {
  projects: any;

  searchForm!: FormGroup;

  showCreateUpdateForm: boolean = false;
  showDetailPage: boolean = false;
  selectedProject: any;

  columns: String[] = ['Name', 'Start Date', 'Budget', 'Status', 'Actions'];

  @ViewChild('createUpdateForm') createUpdateForm!: ElementRef;
  @ViewChild('detailForm') detailForm!: ElementRef;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.projectService.getAll().subscribe({
      next: (res: any) => {
        this.projects = res;
      },
      error: (err) => {
        this.toastService.showToast("Failed to load projects", "error");
        console.log(err);
      }
    });
  }

  reset(){

  }

  generateReport() {

  }

  search() {

  }

  toCreateForm() {
    this.selectedProject = null;
    this.showDetailPage = false;
    this.showCreateUpdateForm = true;
    setTimeout(() => {
      this.scrollToForm();
    }, 100);
  }

  toEditForm(project: any) {
    this.selectedProject = project;
    this.showDetailPage = false;
    this.showCreateUpdateForm = true;

    setTimeout(() => {
      this.scrollToForm();
    }, 100);
  }

  viewDetail(project: any) {
    this.selectedProject = project;
    this.showCreateUpdateForm = false;
    this.showDetailPage = true;

    setTimeout(() => {
      this.scrollToForm();
    }, 100);
  }

  scrollToForm() {
    if (this.createUpdateForm) {
      this.createUpdateForm.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (this.detailForm) {
      this.detailForm.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  closeForm() {
    this.showCreateUpdateForm = false;
  }

  delete(id: number) {
    this.projectService.delete(id).subscribe((res) => {
      if (res.deleted) {
        this.toastService.showToast("Delete project successfully", "success");
        this.getAll();
      } else {
        this.toastService.showToast("Delete project failed", "error");
      }
    });
  }

}
