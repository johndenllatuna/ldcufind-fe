import { Component } from '@angular/core';
import { Router } from '@angular/router';
// 1. Import Reactive Forms tools
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  // 2. Add ReactiveFormsModule to your imports array
  imports: [ReactiveFormsModule], 
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class Login {
  
  // 3. Create the Form Group and set the rules!
  loginForm = new FormGroup({
    // Email requires something typed in, AND it must be a valid email format (with an @)
    email: new FormControl('', [Validators.required, Validators.email]),
    // Password just requires something to be typed in
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  onSignIn(event: Event) {
    event.preventDefault(); 
    
    // 4. Check if the form follows all the rules before navigating
    if (this.loginForm.valid) {
      this.router.navigate(['/dashboard']); 
    } else {
      // If they bypassed the button disable somehow, highlight the errors
      this.loginForm.markAllAsTouched();
    }
  }
}