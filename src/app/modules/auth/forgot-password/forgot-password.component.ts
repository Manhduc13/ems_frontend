import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast/toast.service';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPasswordService } from '../../../services/forgotPassword/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email: string | null = null;
  token: string | null = null;
  tokenVerify: Boolean = false;

  emailVerificationForm!: FormGroup;
  newPasswordForm!: FormGroup;
  showNewPasswordForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getLinkInfo();
    this.getEmailVerificationForm();
    this.getNewPasswordForm();
  }

  getLinkInfo() {
    this.route.paramMap.subscribe(params => {
      const emailParam = params.get('email');
      const tokenParam = params.get('token');

      this.email = (emailParam && emailParam !== ':email') ? emailParam : null;
      this.token = (tokenParam && tokenParam !== ':token') ? tokenParam : null;

      if (this.token && this.email) {
        this.forgotPasswordService.verifyToken(this.token).subscribe((res) => {
          if (res.verify) {
            this.tokenVerify = true;
            this.showNewPasswordForm = true;
            this.getNewPasswordForm();
          } else {
            this.toastService.showToast("Invalid or expired token", "error");
            this.router.navigate(['/forgot-password']);
          }
        });
      }
    });
  }

  getEmailVerificationForm() {
    if (!this.email && !this.token) {
      this.emailVerificationForm = this.fb.group({
        email: [null, [
          Validators.required,
          Validators.pattern('^[\\w\\-.]+@[\\w\\-]+\\.[a-zA-Z]{2,4}$')
        ]],
      });
    }
  }

  getNewPasswordForm() {
    if (this.showNewPasswordForm) {
      this.newPasswordForm = this.fb.group({
        email: [this.email || null, [Validators.required]],
        newPassword: [null, [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-=+<>?])[A-Za-z\d!@#$%^&*()\-=+<>?]{8,12}$/)
        ]],
        confirmPassword: [null, [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    }
  }

  private passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return newPassword && confirmPassword && newPassword !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  backToLogin() {
    if (this.emailVerificationForm) {
      this.emailVerificationForm.reset();
    }

    if (this.newPasswordForm) {
      this.newPasswordForm.reset();
    }

    this.showNewPasswordForm = false;

    this.router.navigateByUrl('/login');
  }

  resetPassword() {
    if (this.newPasswordForm.valid) {
      this.forgotPasswordService.changePassword(this.newPasswordForm.value).subscribe({
        next: (res) => {
          this.toastService.showToast("Reset password successfully", "success");
          this.backToLogin();
        },
        error: (err) => {
          console.error("Reset password error:", err);
          this.toastService.showToast("Failed to reset password", "error");
        }
      });
    }
  }

  sendEmail() {
    if (this.emailVerificationForm.valid) {
      this.forgotPasswordService.verifyEmail(this.emailVerificationForm.value).subscribe({
        next: (res) => {
          console.log("Email sent successfully:", res);
          this.toastService.showToast("Please check your email", "success");
        },
        error: (err) => {
          console.error("Email verification failed:", err);
          this.toastService.showToast("Email verification failed", "error");
        }
      });
    }
  }
}
