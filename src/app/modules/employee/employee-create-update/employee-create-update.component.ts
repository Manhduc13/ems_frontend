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
    });

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
      if (this.employee) {
        this.employeeService.update(this.employee.id, this.createUpdateForm.value).subscribe(() => {
          this.toastService.showToast('Employee updated successfully', 'success');
          this.refresh.emit();
          this.close.emit();
        });
      } else {
        this.employeeService.create(this.createUpdateForm.value).subscribe(() => {
          this.toastService.showToast('Employee added successfully', 'success');
          this.refresh.emit();
          this.close.emit();
        });
      }

    } else {
      console.error('Form is invalid:', this.createUpdateForm);
    }
  }
}
