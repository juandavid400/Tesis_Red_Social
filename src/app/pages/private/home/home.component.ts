import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { RegisterService } from "src/app/shared/services/register.service";
import { UserI } from 'src/app/shared/interfaces/UserI';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import {  FormControl, FormGroup, NgForm, Validators, FormBuilder,} from "@angular/forms";
import * as firebase from 'firebase';
import { Router } from '@angular/router';
//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from 'src/app/pipes/filter.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  FormAdd = new FormGroup({
    Numbercontact: new FormControl(),
    Namecontact: new FormControl()
  });

  subscriptionList: {
    connection: Subscription,
    msgs: Subscription
  } = {
      connection: undefined,
      msgs: undefined
  };
  
  searchBoxHome= '';

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  constructor(public authService: AuthService,
    public chatService: ChatService,
    private firebaseAuth:AngularFireAuth, 
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService,
    private filter: FilterPipe) {}

    registerList: UserI[];
    bookList: UserI[];
    bookComents: any[] = [];
    register= [];
    itemRef: any;
    

    ngOnInit(): void {
      // this.initChat();
      let $this = this;
      this.UserAcount();
      this.registerService.getRegister()
      .snapshotChanges().subscribe(item => {
        this.registerList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.registerList.push(x as UserI);
        });
      });
      
      this.registerService.getBooks()
      .snapshotChanges().subscribe(item => {
        this.bookList = [];
        item.forEach((element) => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.bookList.push(x as UserI);
        });
        $this.coments(this.bookList);
      });
      
    }


   async coments(books){

    let arr = [];
    let flag = 0;
    let flag2 = 0;
    let $this = this;

    var rango = Object.keys(books[0]).map((key) => [(key), books[0][key]]);
      for (let i = 0; i < books.length; i++) {                          
        for (let j = 0; j < rango.length; j++) {
          if (flag == 0){
            var result = Object.keys(books[i]).map((key) => [(key), books[i][key]]);
          } else if (j == result[i].length){
            var result = Object.keys(books[i]).map((key) => [(key), books[i][key]]);
          }

          if (result[i][0]=="Comentarios"){
            var result2 = Object.keys(result[i][1]).map((key) => [(key), result[i][1][key]]);
            for (let k = 0; k < result2.length; k++) {
              let temp = result2[k][1];
              temp.img="../../../../../../assets/img/NoImage.png";
              $this.bookComents.push(temp);
            }
            break
          }
          flag ++;         
        }  
      }
    }

      UserAcount (){
      // var user = this.firebaseAuth.auth.currentUser;
      
      let $this = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
  
          // User is signed in.
          
          if (user != null) {
            user.providerData.forEach(function (profile) {
              // console.log("Sign-in provider: " + profile.providerId);
              // console.log("  Provider-specific UID: " + profile.uid);
              // console.log("  Name: " + profile.displayName);
              // console.log("  Email: " + profile.email);
              // $this.addBookToUser(profile.email,"");
            });
          }
          // console.log(user);
        } else {
          // No user is signed in.
        }
      });
    }


  async  doLogout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  imagen: any;
  titulo: any;
  autor: any;
  confirm: any = false;
  contador: number= 0;
  arr: any[] = [];

  ngFormLibro = new FormGroup({
    imagen: new FormControl(),
    titulo: new FormControl(),
    autor: new FormControl(),      
  });

  async addBookToUser(i){
    let Key;
    let index = i.split("-");

    const Email = firebase.auth().currentUser.email;
      let imgText = "imagen";
    this.imagen = document.querySelector('#'+imgText+index[1]);         
      this.imagen = this.imagen.src;  

      let titText = "titulo";
      this.titulo = document.querySelector('#'+titText+index[1]);      
      this.titulo = this.titulo.textContent;

      let autorText = "autor";
      this.autor = document.querySelector('#'+autorText+index[1]);      
      this.autor = this.autor.textContent;

      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          // console.log("entre nivel1");
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            user.forEach((info) => {
              info.forEach((MisLibros) => {
                MisLibros.forEach((Libros) => {
                  const LibrosChildKey = Libros.key;
                  const LibrosChildData = Libros.val();
                if (LibrosChildKey == "Titulo"){
                  if (LibrosChildData == this.titulo){
                    this.arr.push(LibrosChildData);
                  }
                }
                });
                
              });
            });
          }        
        });
      });
      for (let i = 0; i < this.arr.length; i++) {
        if (this.arr[i]==this.titulo){
          this.contador ++;
        }        
      }
      if (this.contador==0){
        this.confirm = true;
      } else {
        this.toastr.error('El libro ya se encuentra en tu lista', 'Fallido');
      }
      if (this.confirm == true){
        this.firebase.database.ref("registers").child(Key).child("MisLibros").push({
          Imagen: this.imagen,
          Titulo: this.titulo,
          Autor: this.autor,
        });
        this.toastr.success('Libro añadido a tu lista', 'Exitosamente');
      }

    this.contador = 0;
    this.confirm = false;
    this.arr = [];  
  }
  

  // PerfilPhoto(){
  //   const query: string = '#app .PerfilPhoto';
  //   const PerfilPhoto: any = document.querySelector(query);
    
  //   if (this.countPhoto == 0) {
  //     this.countPhoto = 1;
  //     PerfilPhoto.style.left = 0;
  //   } else {
  //     this.countPhoto = 0;
  //     PerfilPhoto.style.left = "-100vh";
  //   }
  // }

  // countPhoto : number = 0;
  
  async SendContact() {
    
    let Key;
    const ContactName = this.FormAdd.controls.Namecontact.value;
    let ContactNumber = this.FormAdd.controls.Numbercontact.value;
    const Email = firebase.auth().currentUser.email;
    let emailRegexp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    let userExist;

    await this.firebase.database.ref('registers').once('value', users => {
      users.forEach(user => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramos", childKey);
        }
        console.log("recorrido", childKey);
      });
    });

    if (ContactNumber.match(emailRegexp)) {
      // Es correo
      // console.log("Es correo");
      userExist = this.registerList.find(user => user.email == ContactNumber);
      ContactNumber = userExist && userExist.email || undefined;
      if (!userExist) {
        console.log("Este usuario no existe")
      } else {
        console.log(ContactName, ContactNumber);
        this.firebase.database.ref('registers').child(Key).child('contacts').push({
          Namecontact: ContactName,
          Numbercontact: ContactNumber,
        });
      }
    } else {
      // console.log("Es teléfono");
      // Es teléfono
      userExist = this.registerList.find(user => user.telefono.e164Number == ContactNumber && user);
      if (!userExist) {
        console.log("Este usuario no existe")
      } else {
        console.log(ContactName, ContactNumber);
        this.firebase.database.ref('registers').child(Key).child('contacts').push({
          Namecontact: ContactName,
          Numbercontact: ContactNumber,
        });
      }
    }

    this.FormAdd.reset({
      Namecontact: "",
      Numbercontact: "",
    });
  }



}
