import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
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
  emailVerificationForm!: FormGroup;
  showNewPasswordForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.emailVerificationForm = this.fb.group({
      email: [null, [
        Validators.required,
        Validators.pattern('^[\\w\\-.]+@[\\w\\-]+\\.[a-zA-Z]{2,4}$')
      ]],
    })
  }

  backToLogin(){
    this.router.navigateByUrl('/login');
  }

  sendEmail(){
    
  }
}
