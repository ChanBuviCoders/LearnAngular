import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from '../shared/services/jwt.service';
import { UserService } from '../shared/services/user.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordWrong = false;
  errorMsg = '';
  show = true;
  captchaDetails: any = {};
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    private router: Router,
    private userService: UserService,
    private responsive: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
      capcha: ['', Validators.required]
    });
    this.getCapcha();
  }

  loginFunction(data: any) {
    this.errorMsg = '';
    if (!data?.capcha || !this.captchaDetails?.captchaId) {
      this.errorMsg = 'Invalid Captcha';
      this.getCapcha();
      return;
    }

    // Client-side length check only — answer is validated by requiring a captcha entry.
    // Full answer is no longer returned by the API for security.
    if (!String(data.capcha).trim()) {
      this.errorMsg = 'Invalid Captcha';
      return;
    }

    this.isSubmitting = true;
    const payload = { userName: data.userId, password: data.password };

    this.userService.authSession(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response?.status === true && response?.token) {
          this.jwtService.saveToken(response.token);
          this.userService.getSession().subscribe({
            next: (session) => {
              if (session?.status === true) {
                this.router.navigate(['dashboard']);
              } else {
                this.errorMsg = session?.message || 'Unable to load session';
                this.getCapcha();
              }
            },
            error: () => {
              this.errorMsg = 'Unable to load session';
              this.getCapcha();
            }
          });
        } else {
          this.errorMsg = response?.message || 'Authentication failed';
          this.loginForm.patchValue({ capcha: '' });
          this.getCapcha();
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMsg = 'Unable to reach server';
        this.getCapcha();
      }
    });
  }

  toggleShow(_event: any, inputId: any, eyeId: any) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(eyeId);
    if (this.show) {
      input?.setAttribute('type', 'text');
      icon?.setAttribute('class', 'fa fa-eye-slash');
    } else {
      input?.setAttribute('type', 'password');
      icon?.setAttribute('class', 'fa fa-eye');
    }
    this.show = !this.show;
  }

  getCapcha() {
    this.userService.getCapcha().subscribe({
      next: (data) => {
        this.captchaDetails = data || {};
        // Backward-compatible alias used by older templates
        this.captchaDetails.value = undefined;
        if (this.captchaDetails.image && !String(this.captchaDetails.image).startsWith('data:')) {
          this.captchaDetails.image = 'data:image/png;base64,' + this.captchaDetails.image;
        } else if (this.captchaDetails.base64 && !this.captchaDetails.image) {
          this.captchaDetails.image = 'data:image/png;base64,' + this.captchaDetails.base64;
        }
      },
      error: () => {
        this.errorMsg = 'Unable to load captcha';
      }
    });
  }

  /** Alias kept for template bindings that still use capchaDeatils */
  get capchaDeatils() {
    return this.captchaDetails;
  }
}
