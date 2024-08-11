import { EmployeeService } from './employee.service';
import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public employees!: Employee[];
  public editEmployees!: Employee;
  addForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      jobTitle: ['', Validators.required, Validators.maxLength(6)],
      phone: ['', Validators.required, Validators.pattern('^[0-9]{9}$')],
      imageUrl: ['', Validators.required]
    });
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => (this.employees = response),
      (error: HttpErrorResponse) => alert(error.message)
    );
  }

  
  public onAddEmployee(): void {
    if (this.addForm.valid) {
      this.employeeService.addEmployee(this.addForm.value).subscribe({
        next: (_response) => {
            alert('Form submitted successfully'),
            this.getEmployees()
        },
        error: (error) => alert(error.message),
        complete: () => alert('Form submission process completed successfully')
      })
    } else {
        alert('Form invalid');
    }
  }

  public onOpenModal(mode: string, employee?: Employee): void {
    const container = document.querySelector('#container-main');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addEmployeeModal');
    }

    if (mode === 'edit' && employee) {
        this.editEmployees = employee;
      button.setAttribute('data-bs-target', '#editEmployeeModal');
    }

    if (mode === 'delete') {
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }
}
