import { Component, OnInit } from "@angular/core";
import {  FormControl, FormGroup, NgForm, Validators, FormBuilder,} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { RegisterService } from "src/app/shared/services/register.service";
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {

  ngForm = new FormGroup({
    name: new FormControl(),
    lname: new FormControl(),
    telefono: new FormControl(),
    email: new FormControl(),    
    password: new FormControl(),    
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private firebaseDB: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.registerService.getRegister();
    this.resetForm();
  }

  createForm() {
    this.ngForm = this.formBuilder.group({
      email: "",
      username: "",
      name: "",
      lname: "",
      password: "",
    });
  }

  onSubmit() {
    
    this.registerService.insertRegister(this.ngForm.value);
    const Email = this.ngForm.controls.email.value;
    const Password = this.ngForm.controls.password.value;

    
    this.firebaseAuth.auth.createUserWithEmailAndPassword(Email, Password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    // this.resetForm(this.ngForm);
  }

  resetForm(registerForm?: NgForm) {
    if (registerForm != null) {
      registerForm.reset();
    }
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
