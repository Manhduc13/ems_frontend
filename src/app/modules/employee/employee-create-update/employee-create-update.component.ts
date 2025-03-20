import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role/role.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ToastService } from '../../../services/toast/toast.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { LoadingComponent } from '../../common/loading/loading.component';

@Component({
  selector: 'app-employee-create-update',
  standalone: true,
  imports: [SharedModule, LoadingComponent],
  templateUrl: './employee-create-update.component.html',
  styleUrl: './employee-create-update.component.css'
})
export class EmployeeCreateUpdateComponent {
  @Input() employee: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  createUpdateForm!: FormGroup;
  roles: any[] = [];
  roleIds: Number[] = [];
  selectedRoles: any[] = [];

  selectedFile!: File;
  imagePreview!: string | ArrayBuffer | null;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private cloudinaryService: CloudinaryService,
    private roleService: RoleService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.createUpdateForm = this.fb.group({
      firstName: [this.employee?.firstName || null, Validators.required],
      lastName: [this.employee?.lastName || null, Validators.required],
      phone: [this.employee?.phone || null, [
        Validators.required,
        Validators.pattern('^(?:\\+84|0)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])\\d{7}$')
      ]],
      email: [this.employee?.email || null, [
        Validators.required,
        Validators.pattern('^[\\w\\-.]+@[\\w\\-]+\\.[a-zA-Z]{2,4}$')
      ]],
      dob: [this.employee?.dob ? this.formatDate(this.employee.dob) : '', Validators.required],
      address: [this.employee?.address || null],
      gender: [this.employee?.gender ?? null, Validators.required],
      roleIds: [this.employee?.roles.map((role: any) => role.id) || [], Validators.required],
      avatar: [this.employee?.avatar || null]
    });

    if (this.employee?.avatar) {
      // Kiểm tra xem avatar có phải Base64 hay là URL
      if (this.employee.avatar.startsWith('/9j/') || this.employee.avatar.startsWith('iVBOR')) {
        this.imagePreview = `data:image/png;base64,${this.employee.avatar}`;
      } else {
        this.imagePreview = this.employee.avatar; // Nếu là URL, dùng luôn
      }
    } else {
      this.imagePreview = null;
    }

    this.getAllRoles();
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee']) {
      this.initializeForm();
    }
  }

  getAllRoles() {
    this.roleService.getAll().subscribe((data: any) => {
      this.roles = data;
      this.setExistingRoles();
    });
  }

  setExistingRoles() {
    if (this.employee?.roles) {
      const selectedRoleIds = this.employee.roles.map((role: any) => role.id);
      this.createUpdateForm.patchValue({ roleIds: selectedRoleIds });
    }
  }


  submitForm() {
    if (this.createUpdateForm.valid) {
      this.isLoading = true;
      let formData = this.createUpdateForm.value;

      if (this.selectedFile) {
        // upload new image then update
        this.cloudinaryService.uploadImage(this.selectedFile).subscribe(
          (response) => {
            // add avatar url to form
            formData.avatar = response.url;
            // call api update
            this.saveEmployee(formData);
          },
          (error) => {
            console.error('Upload error:', error);
            this.toastService.showToast('Upload image failed!', 'error');
            this.isLoading = false;
          }
        );
      } else {
        // update with old avatar
        formData.avatar = this.employee?.avatar || null;
        this.saveEmployee(formData);
      }
    } else {
      this.toastService.showToast('Form is invalid', 'error');
    }
  }

  saveEmployee(employeeData: any) {
    if (this.employee) {
      this.employeeService.update(this.employee.id, employeeData).subscribe({
        next: (res) => {
          this.toastService.showToast('Employee updated successfully', 'success');
          this.refresh.emit();
          this.close.emit();
          this.isLoading = false;
        }, error: (err) => {
          console.error('Update errors:', err);
          this.toastService.showToast('Update failed!', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.employeeService.create(employeeData).subscribe({
        next: (res) => {
          this.toastService.showToast('Employee added successfully', 'success');
          this.refresh.emit();
          this.close.emit();
          this.isLoading = false;
        }, error: (err) => {
          console.error('Create errors:', err);
          this.toastService.showToast('Creation failed!', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: any) {
    if (event && event.target && event.target.files) {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.toastService.showToast("Selected file is not an image", "error");
      }
    }
  }

  previewImage() {
    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) { // Check if the file is an image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastService.showToast("Selected file is not an image or no file selected", "error");
    }
  }
}
