import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent  {

  constructor(private http: Http) {}

  
  person = {
    message:'',
    name:'',
    phone:'',
    email:'',
    jobTitle:'',
    resume:''
  };  
}
