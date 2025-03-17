import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role/role.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-employee-create-update',
  standalone: true,
  imports: [SharedModule],
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
  imageBase64!: string | null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
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
      avatar: [this.employee?.avatar || '']
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

      const employeeData = {
        firstName: this.createUpdateForm.get('firstName')?.value,
        lastName: this.createUpdateForm.get('lastName')?.value,
        phone: this.createUpdateForm.get('phone')?.value,
        email: this.createUpdateForm.get('email')?.value,
        gender: this.createUpdateForm.get('gender')?.value,
        address: this.createUpdateForm.get('address')?.value || '',
        dob: this.createUpdateForm.get('dob')?.value,
        roleIds: this.createUpdateForm.get('roleIds')?.value,
        avatar: this.imageBase64 || this.createUpdateForm.get('avatar')?.value, // base64 hoặc URL
      };

      if (this.employee) {
        this.employeeService.update(this.employee.id, employeeData).subscribe(() => {
          this.toastService.showToast('Employee updated successfully', 'success');
          this.refresh.emit();
          this.close.emit();
        }, (error) => {
          console.error('Lỗi khi cập nhật:', error);
          this.toastService.showToast('Update failed!', 'error');
        });
      } else {
        this.employeeService.create(employeeData).subscribe(() => {
          this.toastService.showToast('Employee added successfully', 'success');
          this.refresh.emit();
          this.close.emit();
        }, (error) => {
          console.error('Lỗi khi tạo mới:', error);
          this.toastService.showToast('Creation failed!', 'error');
        });
      }

    } else {
      this.toastService.showToast('Form is invalid', 'error');
    }
  }

  onFileSelected(event: any) {
    if (event && event.target && event.target.files) {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          this.imageBase64 = (reader.result as string).split(',')[1]; // Chỉ lấy phần Base64
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.toastService.showToast("Selected file is not an image or no file selected", "error");
      }
    } else {
      this.toastService.showToast("No file selected or event is not valid", "error");
    }
  }

  previewImage() {
    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) { // Check if the file is an image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastService.showToast("Selected file is not an image or no file selected", "error");
    }
  }
}
