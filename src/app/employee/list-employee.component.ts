import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  employees: IEmployee[];
  employee: IEmployee;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    /* this.employeeService.getEmployees().subscribe(
      (employeeList) => this.employees = employeeList,
      (err) => console.log(err)
    ); */
    this.loadEmployeeList();
  }

  loadEmployeeList(): void {
    this.employeeService
      .getEmployees()
      .subscribe(
        employeeList => (this.employees = employeeList),
        err => console.log(err)
      );
  }

  editButtonClick(emplId: number): void {
    this.router.navigate(['/employees/edit', emplId]);
  }

  deleteEmployeeBtnClick(emplId: number): void {
    // Delete an employee
    // console.log(emplId);
    this.employeeService
      .deleteEmployee(emplId)
      .subscribe(
        success => { console.log(`Deleted Employee ${emplId}`); 
                     this.loadEmployeeList();
      },
        err => console.log(err)
      );

    // console.log(this.employees.length);
  }

  employeeDetail(emplId: number): void {
    const idx = this.employees.findIndex( (emp) => emp.id === emplId);
    this.employee = this.employees[idx];
    // console.log(idx + ' ' + this.employee.id);
  }

}
