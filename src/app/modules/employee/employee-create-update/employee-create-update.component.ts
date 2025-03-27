import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ToastService } from '../../../services/toast/toast.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { DepartmentService } from '../../../services/department/department.service';
import { LoadingComponent } from '../../shared/loading/loading.component';

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
  selectedFile!: File;
  imagePreview!: string | ArrayBuffer | null;
  isLoading: boolean = false;

  departments: any[] = [];
  positions: any[] = [
    { value: 'DEVELOPER', name: 'Developer' },
    { value: 'TESTER', name: 'Tester' },
    { value: 'DESIGNER', name: 'Designer' },
    { value: 'ACCOUNTANT', name: 'Accountant' },
  ];
  roles: any[] = [
    { value: 'ADMIN', name: 'Admin' },
    { value: 'MANAGER', name: 'Manager' },
    { value: 'EMPLOYEE', name: 'Employee' },
  ]; 
  genders: any[] = [
    { value: 'MALE', name: 'Male' },
    { calue: 'FEMALE', name: 'Female'},
    { calue: 'OTHER', name: 'Other'},
  ]

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private cloudinaryService: CloudinaryService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getAllDepartments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee']) {
      this.initializeForm();
    }
  }

  initializeForm() {
    this.createUpdateForm = this.fb.group({
      firstName: [this.employee?.firstName || '', Validators.required],
      lastName: [this.employee?.lastName || '', Validators.required],
      email: [this.employee?.email || '', [
        Validators.required,
        Validators.pattern('^[\\w\\-.]+@[\\w\\-]+\\.[a-zA-Z]{2,4}$')
      ]],
      phone: [this.employee?.phone || '', [
        Validators.required,
        Validators.pattern('^(?:\\+84|0)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])\\d{7}$')
      ]],
      dob: [this.employee?.dob ? this.formatDate(this.employee.dob) : '', [Validators.required, this.pastDateValidator()]],
      gender: [this.employee?.gender || null, Validators.required],
      address: [this.employee?.address || ''],
      role: [this.employee?.role || null, Validators.required], 
      position: [this.employee?.position || null, Validators.required], 
      department: [this.employee?.department || null, Validators.required]
    });

    this.setAvatarPreview();
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Convert to "yyyy-MM-dd"
  }

  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today ? { futureDate: true } : null;
    };
  }

  getAllDepartments() {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
      }
    });
  }

  setAvatarPreview() {
    if (this.employee?.avatar) {
      if (this.employee.avatar.startsWith('/9j/') || this.employee.avatar.startsWith('iVBOR')) { // Base64
        this.imagePreview = `data:image/png;base64,${this.employee.avatar}`;
      } else {
        this.imagePreview = this.employee.avatar; // URL
      }
    } else {
      this.imagePreview = null;
    }
  }

  submitForm() {
    if (this.createUpdateForm.valid) {
      this.isLoading = true;
      let formData = this.createUpdateForm.value;

      if (this.selectedFile) {
        this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
          next: (response) => {
            formData.avatar = response.url;
            this.saveEmployee(formData);
          },
          error: (err) => {
            console.error('Upload error:', err);
            this.toastService.showToast('Upload image failed!', 'error');
            this.isLoading = false;
          }
        });
      } else {
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
        next: () => {
          this.toastService.showToast('Employee updated successfully', 'success');
          this.refresh.emit();
          this.close.emit();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Update errors:', err);
          this.toastService.showToast('Update failed!', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.employeeService.create(employeeData).subscribe({
        next: () => {
          this.toastService.showToast('Employee added successfully', 'success');
          this.refresh.emit();
          this.close.emit();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Create errors:', err);
          this.toastService.showToast('Creation failed!', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: any) {
    if (event?.target?.files) {
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
}
