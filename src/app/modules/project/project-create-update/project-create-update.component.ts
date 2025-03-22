import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project/project.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-project-create-update',
  standalone: true,
  imports: [SharedModule, LoadingComponent],
  templateUrl: './project-create-update.component.html',
  styleUrl: './project-create-update.component.css'
})
export class ProjectCreateUpdateComponent {

  @Input() project: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  createUpdateForm!: FormGroup;
  statuses: any[] = [
    { value: "PLANNED", name: 'Planned' },
    { value: "IN_PROGRESS", name: 'In Progress' },
    { value: "COMPLETED", name: 'Completed' },
    { value: "ON_HOLD", name: 'On Hold' },
    { value: "CANCELLED", name: 'Cancelled' },
  ]

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.createUpdateForm = this.fb.group({
      name: [this.project?.name || null, Validators.required],
      description: [this.project?.description || null],
      startDate: [this.project?.startDate || null, Validators.required],
      budget: [this.project?.budget || null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      this.initializeForm();
    }
  }

  submitForm() {
    if (this.createUpdateForm.valid) {
      this.isLoading = true;
      this.saveProject(this.createUpdateForm.value);
    } else {
      this.toastService.showToast("Please fill in all required fields", "error");
      this.isLoading = false;
    }
  }

  saveProject(projectData: any) {
    if (this.project) {
      this.projectService.update(this.project.id, projectData).subscribe({
        next: (res) => {
          this.toastService.showToast("Project updated successfully", "success");
          this.refresh.emit();
          this.close.emit();
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.showToast("Update project failed", "error");
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.projectService.create(projectData).subscribe({
        next: (res) => {
          this.toastService.showToast("Project created successfully", "success");
          this.refresh.emit();
          this.close.emit();
          this.isLoading = false;
        },
        error: (err) => {
          this.toastService.showToast("Create project failed", "error");
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }


}
