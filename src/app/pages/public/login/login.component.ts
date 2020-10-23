import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, NgForm, Validators, FormBuilder,} from "@angular/forms";
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { Router } from '@angular/router';
import { RegisterService } from "src/app/shared/services/register.service";
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signupForm = new FormGroup({
    signupEmail: new FormControl(),
    signupPassword: new FormControl(),
  });

  
  
  constructor(private router:Router, private firebase: AngularFireDatabase, 
    private firebaseAuth: AngularFireAuth, private toastr: ToastrService) { }


  ngOnInit(): void {
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  doLogin() {
    
    const Email = this.signupForm.controls.signupEmail.value;
    const Password = this.signupForm.controls.signupPassword.value;

    

   

    this.firebaseAuth.auth.signInWithEmailAndPassword(Email, Password).then(() => {
            
      this.router.navigate(['/home']);
      this.toastr.success('Entro gonorrea', 'En la buena', {
        positionClass: 'toast-top-center'
      });
      
    }).catch(function(error) {
      // this.toastr.error('Password Incorrect', 'Try Again', {
      //   positionClass: 'toast-top-center'
      // });
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

    // this.firebaseAuth.auth.signInWithEmailAndPassword(Email, Password).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });
    // this.router.navigate(['/']);
  }

}
