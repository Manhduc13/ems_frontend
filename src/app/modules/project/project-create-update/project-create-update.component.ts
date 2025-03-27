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

  @Input() project: { 
    id?: number;
    name: string; 
    description?: string; 
    startDate: string;
    budget: number;
  } | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  createUpdateForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.createUpdateForm = this.fb.group({
      name: [this.project?.name || null, Validators.required],
      description: [this.project?.description || null],
      startDate: [this.project?.startDate || null, [
        Validators.required,
        this.validateFutureOrPresentDate
      ]],
      budget: [this.project?.budget || null, [
        Validators.required
      ]],
    });
  }

  submitForm() {
    if (this.createUpdateForm.invalid) {
      this.toastService.showToast("Please fill in all required fields", "error");
      return;
    }

    this.isLoading = true;
    const projectData = this.createUpdateForm.value;
    this.saveProject(projectData);
  }

  saveProject(projectData: any) {
    if (this.project?.id) {
      this.projectService.update(this.project.id, projectData).subscribe({
        next: () => {
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
        next: () => {
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

  validateFutureOrPresentDate(control: any) {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return { pastDate: true };
    }
    return null;
  }
}
