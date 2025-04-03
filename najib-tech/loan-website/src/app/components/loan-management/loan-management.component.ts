import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoanService, Loan } from '../../loan.service';

@Component({
  selector: 'app-loan-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './loan-management.component.html',
  styleUrls: ['./loan-management.component.css'],
  providers: [LoanService] // Add this line to provide the service
})
export class LoanManagementComponent implements OnInit {
  isLoading: boolean = false;
  loans: Loan[] = [];
  loanForm: FormGroup;
  searchForm: FormGroup;
  searchByIdForm: FormGroup;
  selectedLoan: Loan | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private loanService: LoanService,
    private fb: FormBuilder
  ) {
    this.loanForm = this.fb.group({
      borrowerName: ['', Validators.required],
      repaymentAmount: [0, [Validators.required, Validators.min(0)]],
      fundingAmount: [0, [Validators.required, Validators.min(0)]]
    });

    this.searchForm = this.fb.group({
      borrowerName: ['', Validators.required]
    });

    this.searchByIdForm = this.fb.group({
      loanId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllLoans();
  }

  loadAllLoans(): void {
    this.isLoading = true;
    this.loanService.getAllLoans().subscribe({
      next: (data: Loan[]) => {
        this.loans = data || [];
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load loans: ' + error.message;
        this.loans = [];
        this.isLoading = false;
      }
    });
  }

  searchByBorrowerName(): void {
    if (this.searchForm.valid) {
      const borrowerName = this.searchForm.get('borrowerName')?.value;
      console.log('Searching for borrower:', borrowerName);
      this.isLoading = true;
      
      this.loanService.getLoanByBorrowerName(borrowerName).subscribe({
        next: (data: any) => {
          console.log('Search result:', data);
          this.isLoading = false;
          this.errorMessage = '';
          
          // Handle both single loan and array of loans
          if (Array.isArray(data)) {
            this.loans = data;
          } else {
            // If a single loan is returned, put it in an array
            this.loans = [data];
          }
          
          console.log('Processed loans:', this.loans);
          
          if (this.loans.length === 0) {
            this.successMessage = 'No loans found for this borrower.';
          } else {
            this.successMessage = `Found ${this.loans.length} loan(s) for ${borrowerName}.`;
          }
        },
        error: (error: any) => {
          console.error('Search error:', error);
          this.isLoading = false;
          this.errorMessage = 'Failed to search loans: ' + error.message;
          this.loans = [];
        }
      });
    }
  }

  searchById(): void {
    if (this.searchByIdForm.valid) {
      const loanId = this.searchByIdForm.get('loanId')?.value;
      this.loanService.getLoanById(loanId).subscribe({
        next: (data: Loan) => {
          this.selectedLoan = data;
          this.errorMessage = '';
          this.successMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to find loan: ' + error.message;
          this.selectedLoan = null;
        }
      });
    }
  }

  addLoan(): void {
    if (this.loanForm.valid) {
      const newLoan = this.loanForm.value;
      this.loanService.addLoan(newLoan).subscribe({
        next: (data: Loan) => {
          this.successMessage = 'Loan added successfully!';
          this.errorMessage = '';
          this.loanForm.reset({
            borrowerName: '',
            repaymentAmount: 0,
            fundingAmount: 0
          });
          this.loadAllLoans();
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to add loan: ' + error.message;
        }
      });
    }
  }

  deleteLoan(loanID: string): void {
    if (confirm('Are you sure you want to delete this loan?')) {
      this.isLoading = true;
      this.loanService.deleteLoan(loanID).subscribe({
        next: (response) => {
          this.successMessage = 'Loan deleted successfully!';
          this.errorMessage = '';
          this.loadAllLoans();
          if (this.selectedLoan?.loanID === loanID) {
            this.selectedLoan = null;
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete loan: ' + error.message;
          this.isLoading = false;
        }
      });
    }
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.loadAllLoans();
  }

  clearSelectedLoan(): void {
    this.selectedLoan = null;
    this.searchByIdForm.reset();
  }
}