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

  showCreateUpdateForm: boolean = true;
  showDetailPage: boolean = false;
  selectedProject: any;

  keyword: any;
  page: number = 0;
  size: number = 5;
  pageInfo: any;

  columns: String[] = ['No', 'Name', 'Start Date', 'Budget', 'Status', 'Actions'];

  @ViewChild('createUpdateForm') createUpdateForm!: ElementRef;
  @ViewChild('detailForm') detailForm!: ElementRef;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.getAll();
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      keyword: ['']
    });
  }

  getAll() {
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
    if (newPage >= 0 && newPage < this.pageInfo.totalPages) {
      this.page = newPage;
      this.getAll();
    }
  }

  changePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.size = Number(selectElement.value);
    this.page = 0;
    this.getAll();
  }

  generateReport() {

  }

  search() {
    this.getAll();
  }

  reset() {
    this.searchForm.reset({ keyword: '' }); 
    this.page = 0;
    this.getAll();
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

  closeDetailPage() {
    this.showDetailPage = false;
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
