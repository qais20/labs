import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanManagementComponent } from './components/loan-management/loan-management.component';
import { TestComponent } from './test.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoanManagementComponent, TestComponent, HttpClientModule],
  template: `
    <div class="container mt-4">
      <h1>Loan Management System</h1>
      <app-test></app-test>
      <hr>
      <app-loan-management></app-loan-management>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'loan-website';
}