import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, NgForm, Validators, FormBuilder,} from "@angular/forms";
//import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { Router } from '@angular/router';
//import { AngularFireAuth } from 'angularfire2/auth';
 import { AngularFireAuth } from '@angular/fire/auth';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/custom-validators'; 
import { RegisterService } from "src/app/shared/services/register.service";
import * as firebase from 'firebase';
//import * as io from 'socket.io-client';



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

  //
  
  constructor(private router:Router, /*private firebase: AngularFireDatabase*/ 
    private firebaseAuth: AngularFireAuth, private toastr: ToastrService, private registerService: RegisterService) { }

    registerList: UserI[];
    register= [];
    itemRef: any;

  ngOnInit(): void {

    this.registerService.getRegister()
      .snapshotChanges().subscribe(item => {
        this.registerList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.registerList.push(x as UserI);
        });
      });
    
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  doLogin() {
    
    let email = this.signupForm.controls.signupEmail.value;
    const password = this.signupForm.controls.signupPassword.value;

    let emailRegexp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

    let userExist;
    if(email.match(emailRegexp)){
      // Es correo
      console.log(this.registerList);
      console.log("Es correo");
      userExist = this.registerList.find( user => user.email == email);
      console.log(userExist);
    } else {
      console.log("Es teléfono");
      // Es teléfono
      userExist = this.registerList.find( user => user.telefono.e164Number == email && user);
      email = userExist && userExist.email || undefined;
      console.log(email);
      //io.on('connection', (socket) => {
      //console.log("Se conecto"+email+"con el ID"+socket.id);})
    }

    if(userExist){
      
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        this.router.navigate(['/home']);
        this.toastr.success('Ingreso exitoso', '', {
          positionClass: 'toast-top-center'
        });
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(`Error [${errorCode}]: ${errorMessage}`);
      });
      } else {
      this.toastr.success('El usuario no esta registrado', 'Fallido', {
        positionClass: 'toast-top-center'
      });
        }  
    }
}
