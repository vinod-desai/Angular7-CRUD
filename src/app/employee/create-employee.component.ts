import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray
} from '@angular/forms';
import { CustomEmailValidators } from '../shared/custom-email.validators';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  // fullNameLength = 0;
  validationMessages = {
    fullName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 4 characters.',
      maxlength: 'Full Name must be less than 15 characters.'
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email domain should be oracle.com'
    },
    confirmEmail: {
      required: 'Confirm email is required.'
    },
    emailGroup: {
      emailMissMatch: 'Email and Confirm Email do not match'
    },
    phone: {
      required: 'Phone is required.'
    },
    skillName: {
      required: 'Skill Name is required.'
    },
    experienceInYears: {
      required: 'Experience is required.'
    },
    proficiency: {
      required: 'Proficiency is required.'
    }
  };

  formErrors = {
    fullName: '',
    email: '',
    confirmEmail: '',
    emailGroup: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    proficiency: ''
  };
  employee: IEmployee;
  pageTitle: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Creating Form using FromGroup & FormControl Classes --> (AbstractControl class)
    /*  this.employeeForm = new FormGroup({
       fullName: new FormControl(),
       email: new FormControl(),
       skills: new FormGroup({
         skillName: new FormControl(),
         experienceInYears: new FormControl(),
         proficiency: new FormControl()
       })
     }); */
    // using FormBuilder
    this.employeeForm = this.fb.group({
      fullName: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(15)]
      ],
      contactPreference: ['email'],
      emailGroup: this.fb.group(
        {
          email: [
            '',
            [
              Validators.required,
              CustomEmailValidators.emailDomain('oracle.com')
            ]
          ],
          confirmEmail: ['', Validators.required]
        },
        { validator: matchEmail }
      ),
      phone: [''],
      skills: this.fb.array([this.addSkillFormGroup()])
    });

    /* valueChanges property of fromControl
    this.employeeForm.get('fullName').valueChanges.subscribe( (value: string) => {
      return this.fullNameLength = value.length;
    });
    // valueChanges property of FormGroup
    this.employeeForm.valueChanges.subscribe( (value: any) => {
      console.log(JSON.stringify(value));
    });
    this.employeeForm.get('skills').valueChanges.subscribe( (value: any) => {
      console.log(JSON.stringify(value));
    }); */

    // Validate Form
    this.employeeForm.valueChanges.subscribe((value: any) => {
      this.logValidationErrors(this.employeeForm);
    });
    // Add validators dynamically on phone control
    this.employeeForm
      .get('contactPreference')
      .valueChanges.subscribe((value: string) => {
        this.onContactPreferenceChange(value);
      });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        // Create New Employee
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }

  getEmployee(empID: number) {
    this.employeeService.getEmployee(empID).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (err: any) => console.log(err)
    );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });
    this.employeeForm.setControl(
      'skills',
      this.setExistingSkills(employee.skills)
    );
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(
        this.fb.group({
          skillName: s.skillName,
          experienceInYears: s.experienceInYears,
          proficiency: s.proficiency
        })
      );
    });
    return formArray;
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);

      // If the control is a FormControl
      // Clear the existing validation errors
      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched ||
          abstractControl.dirty ||
          abstractControl.value !== '')
      ) {
        // Get all the validation messages of the form control
        // that has failed the validation
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      // If the control is nested form group, recursively call this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

      // If the control is nested form array, recursively call this same method
      /* if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }
      } */
    });
  }

  validateForm(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

  onSubmit() {
    // console.log(this.employeeForm.value);
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.employeeService
        .updateEmployee(this.employee)
        .subscribe(
          () => this.router.navigate(['employees']),
          (err: any) => console.log(err)
        );
    } else {
      this.employeeService
        .addEmployee(this.employee)
        .subscribe(
          () => this.router.navigate(['employees']),
          (err: any) => console.log(err)
        );
    }
  }

  mapFormValuesToEmployeeModel() {
    console.log(this.employeeForm);
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  onContactPreferenceChange(val: string) {
    // console.log('on contact preference change ' + val);
    const phoneControl = this.employeeForm.get('phone');
    if (val === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(idx: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(idx);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
}
/*
function emailDomain(domainName: string) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);
    if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
      return null;
    } else {
      return { emailDomain: true };
    }
  };
} */

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (
    emailControl.value === confirmEmailControl.value ||
    (confirmEmailControl.pristine && confirmEmailControl.value === '')
  ) {
    return null;
  } else {
    return { emailMissMatch: true };
  }
}
