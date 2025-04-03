import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>API Test</h2>
      <div>
        <button (click)="getAllLoans()">Get All Loans</button>
      </div>
      <div style="margin-top: 10px;">
        <input [(ngModel)]="borrowerName" placeholder="Borrower Name">
        <button (click)="searchByName()">Search by Name</button>
      </div>
      <div style="margin-top: 10px;">
        <input [(ngModel)]="loanId" placeholder="Loan ID (GUID)">
        <button (click)="getLoanById()">Get by ID</button>
        <button (click)="deleteLoan()">Delete Loan</button>
      </div>
      <div *ngIf="result" style="margin-top: 10px;">
        <h3>Result:</h3>
        <pre>{{ result | json }}</pre>
      </div>
      <div *ngIf="error" style="margin-top: 10px; color: red;">
        <h3>Error:</h3>
        <pre>{{ error }}</pre>
      </div>
      <div *ngIf="isLoading" style="margin-top: 10px;">
        <p>Loading...</p>
      </div>
    </div>
  `
})
export class TestComponent {
  borrowerName = '';
  loanId = '';
  result: any;
  error = '';
  isLoading = false;
  
  private apiUrl = '/api/loan';
  
  constructor(private http: HttpClient) {}
  
  getAllLoans() {
    this.isLoading = true;
    this.error = '';
    this.result = null;
    
    this.http.get(`${this.apiUrl}/all`)
      .pipe(
        tap(data => console.log('All loans data:', data)),
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          this.result = data;
          this.isLoading = false;
        },
        error: (err) => {
          // Error is handled in the catchError operator
          this.isLoading = false;
        }
      });
  }
  
  searchByName() {
    if (!this.borrowerName) {
      this.error = 'Please enter a borrower name';
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    this.result = null;
    
    this.http.get(`${this.apiUrl}?borrowerName=${encodeURIComponent(this.borrowerName)}`)
      .pipe(
        tap(data => console.log('Search by name data:', data)),
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          this.result = data;
          this.isLoading = false;
        },
        error: (err) => {
          // Error is handled in the catchError operator
          this.isLoading = false;
        }
      });
  }
  
  getLoanById() {
    if (!this.loanId) {
      this.error = 'Please enter a loan ID';
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    this.result = null;
    
    this.http.get(`${this.apiUrl}/${this.loanId}`)
      .pipe(
        tap(data => console.log('Get by ID data:', data)),
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          this.result = data;
          this.isLoading = false;
        },
        error: (err) => {
          // Error is handled in the catchError operator
          this.isLoading = false;
        }
      });
  }
  
  deleteLoan() {
    if (!this.loanId) {
      this.error = 'Please enter a loan ID';
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    this.result = null;
    
    this.http.delete(`${this.apiUrl}/${this.loanId}`, { responseType: 'text' })
      .pipe(
        tap(data => console.log('Delete response:', data)),
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          this.result = { success: true, message: data };
          this.isLoading = false;
        },
        error: (err) => {
          // Error is handled in the catchError operator
          this.isLoading = false;
        }
      });
  }
  
  private handleError(error: HttpErrorResponse) {
    this.isLoading = false;
    console.error('API Error:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      this.error = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      this.error = `Server Error: ${error.status} - ${error.statusText}\n${JSON.stringify(error, null, 2)}`;
    }
    
    return throwError(() => error);
  }
}