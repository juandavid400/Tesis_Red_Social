import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RegisterService } from 'src/app/shared/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    ngForm = new FormGroup({
    email: new FormControl(),
    username: new FormControl(),
    password: new FormControl(),
    name: new FormControl(),
    lname: new FormControl(),    
    });
     
    

  constructor(private router:Router, private authService:AuthService, private registerService: RegisterService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerService.getRegister();
    this.resetForm();
  }

  createForm() {
    this.ngForm = this.formBuilder.group({
      email: '',
      username: '',
      name: '',
      lname: '',
      password: '',
    });
}

  onSubmit(){
    console.log(this.ngForm.value);
    this.registerService.insertRegister(this.ngForm.value);
    
    // this.resetForm(this.ngForm);
  }

  resetForm(registerForm?: NgForm){
    if (registerForm != null) {
       registerForm.reset(); 
    }
  }

  // doRegister(e) {
  //   e.preventDefault();

  //   const user: UserI = {
  //     email: "pabhoz@usbcali.edu.co",
  //     username: "pabhoz",
  //     lname: "Bejarano",
  //     password: "suanfanzon",
  //     name: "Pablo",
  //   };

  //   console.log(this.userForm);

  //   //this.authService.login(user);

  //   //this.router.navigate(['/']);
  // }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
