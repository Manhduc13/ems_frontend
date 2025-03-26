import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { StorageService } from '../../../services/storage/storage.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.isLogin();
    this.inititializeForm();
  }

  isLogin() {
    const isLogin = this.authService.validateToken();
    if(isLogin) {
      this.router.navigateByUrl("/");
    }
  }

  inititializeForm() {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe((res) => {
      if (res) {
        this.toastService.showToast("Login successfully", "success");
        this.storageService.saveToken(res.accessToken);
        this.authService.setIsLoggedIn(true);
        this.router.navigateByUrl("/employees");
      }
    }, error => {
      this.toastService.showToast("Login failed", "error");
    })
  }
}
