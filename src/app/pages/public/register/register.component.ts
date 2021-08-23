import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {  FormControl, FormGroup, NgForm, Validators, FormBuilder,} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { RegisterService } from "src/app/shared/services/register.service";
//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireDatabase,AngularFireList}from '@angular/fire/database';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { CustomValidators } from 'src/app/custom-validators';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { UserI } from 'src/app/shared/interfaces/UserI';
// import * as io from 'socket.io-client';
import * as firebase from 'firebase';



@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	phoneForm = new FormGroup({
		phone: new FormControl(undefined, [Validators.required])
	});

	changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  
  ngForm = new FormGroup({
    name: new FormControl(),
    lname: new FormControl(),
    telefono: new FormControl(),
    email: new FormControl(),    
    password: new FormControl(),
    confirmPassword: new FormControl(),      
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private firebaseDB: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    private toastr: ToastrService
  ) {

    this.ngForm = this.createSignupForm();
  }

  createSignupForm(): FormGroup {
    return this.formBuilder.group(
      { 
        telefono: "",
        name: "",
        lname: "",
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            // CustomValidators.patternValidator(/\d/, {
            //   hasNumber: true
            // }),
            // // check whether the entered password has upper case letter
            // CustomValidators.patternValidator(/[A-Z]/, {
            //   hasCapitalCase: true
            // }),
            // // check whether the entered password has a lower case letter
            // CustomValidators.patternValidator(/[a-z]/, {
            //   hasSmallCase: true
            // }),
            // check whether the entered password has a special character
            // CustomValidators.patternValidator(
            //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            //   {
            //     hasSpecialCharacters: true
            //   }
            // ),
            Validators.minLength(6)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

    registerList: UserI[];
    register= [];
    itemRef: any;
    email: any = "ejemplo";

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
  
  createForm() {
    this.ngForm = this.formBuilder.group({
      email: "",
      telefono: "",
      name: "",
      lname: "",
      password: "",
      confirmPassword: "",
      // socketId: "",
    });
  }

  onSubmit() {
    
    const Email = this.ngForm.controls.email.value;
    const telefono = this.ngForm.controls.telefono.value;
    const Password = this.ngForm.controls.password.value;
    const ConfirmPassword = this.ngForm.controls.confirmPassword.value;
    let EmailExist = this.registerList.find(user => user.email == Email);
    let PhoneExist = this.registerList.find(user => user.telefono.e164Number == telefono.e164Number);
    
    // let socket = io();
    //   let id : any; 
    //   //on connect Event 
    //   socket.on('connect', () => {
    //       //get the id from socket
    //       let id = socket.id;
    //       console.log(id);
    //      return id;
    //   });
  
    if (EmailExist) {
      console.log("Ya existe este email");
      this.toastr.error('Ese correo ya esta registrado', 'Intenta otro correo', {
        positionClass: 'toast-top-center'
      });
    } else if (PhoneExist) {
      this.toastr.error('El número ya esta registrado', 'Intenta otro número', {
        positionClass: 'toast-top-center'
      });
      console.log("Ya existe este número");
    } else {
      
      firebase.auth().createUserWithEmailAndPassword(Email, Password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
      this.registerService.insertRegister(this.ngForm.value);
      if (ConfirmPassword == Password) {
        firebase.auth().createUserWithEmailAndPassword(Email, Password).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
        });

    
      // this.resetForm();
      // this.ngForm.reset({
      //   email : '',
      //   telefono: '',
      //   name: '',
      //   lname: '',
      //   password: '',
      //   confirmPassword: '',
      // });
      this.email = Email;
      firebase.auth().signInWithEmailAndPassword(Email, Password).then(() => {
        this.router.navigate(['/tags']);
        this.toastr.success('Cuenta creada', 'Exitosamente', {
          positionClass: 'toast-top-center'
        });
      }) 
      console.log("this.email");  
      console.log(this.email);
        
      this.router.navigate(["/tags"]); 
        }  
    
      }
    }

  
  async doLogout() {
    await this.authService.logout();
    this.router.navigate(["/"]);
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  goToTags() {
    this.router.navigate(["/tags"]);
  }

  addcontact(count: number) {
    const query: string = "#app .addcontact";
    const addcontact: any = document.querySelector(query);

    if (count == 0) {
      count = 1;
      addcontact.style.left = 0;
    } else {
      count = 0;
      addcontact.style.left = "-100vh";
    }
  }

  areaEstados() {
    const query: string = "#app .areaEstados";
    const areaEstados: any = document.querySelector(query);

    if (this.countEstad == 0) {
      this.countEstad = 1;
      areaEstados.style.left = 0;
    } else {
      this.countEstad = 0;
      areaEstados.style.left = "-100vh";
    }
  }

  countEstad: number = 0;

  openaddContact(){
    if (this.count == 0){
      this.count = 1;
      this.addcontact(this.count);
    } else {      
      this.count = 0;
      this.addcontact(this.count);
    }
  }

  count: number = 1;

  SettingsToggle() {
    const query: string = "#app .DesplegableLeftMore";
    const DesplegableLeftMore: any = document.querySelector(query);

    if (this.countSett == 0) {
      this.countSett = 1;
      DesplegableLeftMore.style.opacity = 1;
      DesplegableLeftMore.style.transform = "scale(1)";
    } else {
      this.countSett = 0;
      DesplegableLeftMore.style.opacity = 0;
      DesplegableLeftMore.style.transform = "scale(0)";
    }
  }

  countSett: number = 0;

  createGroup() {
    const query: string = "#app .newGroupContainer";
    const newGroupContainer: any = document.querySelector(query);

    if (this.countGroup == 0) {
      this.countGroup = 1;
      newGroupContainer.style.left = 0;
    } else {
      this.countGroup = 0;
      newGroupContainer.style.left = "-100vh";
    }
  }

  countGroup: number = 0;

  createImageGroup() {
    const query: string = "#app .updateImageGroup";
    const updateImageGroup: any = document.querySelector(query);

    if (this.countImageGroup == 0) {
      this.countImageGroup = 1;
      updateImageGroup.style.left = 0;
    } else {
      this.countImageGroup = 0;
      updateImageGroup.style.left = "-100vh";
    }
  }

  countImageGroup: number = 0;
}
