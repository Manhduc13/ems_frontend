import { Component } from '@angular/core';
import { StorageService } from '../../../services/storage/storage.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userInfo: any = null;
  employee: any = null;
  changePassword: boolean = false;

  changePasswordForm!: FormGroup;

  constructor(
    private storageService: StorageService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserInfo();
    this.initializeForm();
  }

  initializeForm() {
    this.changePasswordForm = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-=+<>?])[A-Za-z\d!@#$%^&*()\-=+<>?]{8,12}$/)
      ]],
      confirmPassword: [null, [Validators.required]]
    }, { validators: this.passwordMatchValidator })
  }

  private passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return newPassword && confirmPassword && newPassword !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  getGoogleMapsUrl(address: string | undefined): string {
    if (!address) return ''; // Handle case when address is empty
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  loadUserInfo() {
    this.userInfo = this.storageService.getUserInfo();
    this.employeeService.getById(this.userInfo.id).subscribe((res) => {
      this.employee = res;
    });
  }

  getChangePasswordForm() {
    this.changePassword = true;
  }

  submitForm() {
    if (this.changePasswordForm.valid) {
      this.employeeService.changePassword(this.employee.id, this.changePasswordForm.value).subscribe({
        next: (res) => {
          this.toastService.showToast("Change password successfully", "success");
          this.toastService.showToast("You need to login again!", "info");
          this.router.navigateByUrl("/login");
        }, error: (err) => {
          this.toastService.showToast("Change password failed", "error");
          console.log("Error: ", err);
        }
      })
    }
  }

  closeChangePasswordForm() {
    this.changePassword = false;
  }
}
