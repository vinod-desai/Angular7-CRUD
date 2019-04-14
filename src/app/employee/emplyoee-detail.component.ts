import { Component, OnInit, Input } from '@angular/core';
import { IEmployee } from './IEmployee';

@Component({
  selector: 'app-emplyoee-detail',
  templateUrl: './emplyoee-detail.component.html',
  styleUrls: ['./emplyoee-detail.component.css']
})
export class EmplyoeeDetailComponent implements OnInit {
  @Input() employee: IEmployee;
  constructor() { }

  ngOnInit() {
    
  }

}
