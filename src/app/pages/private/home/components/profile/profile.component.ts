import { Component, EventEmitter, OnDestroy, OnInit, Output, Directive,HostListener} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";
import { ChatService } from "src/app/shared/services/chat/chat.service";
// import { ChatI } from "./interfaces/ChatI";
// import { Group } from "./interfaces/Group";
// import { MessageI } from "./interfaces/MessageI";
import { RegisterService } from "src/app/shared/services/register.service";
import { UserI } from "src/app/shared/interfaces/UserI";
import { AngularFireAuth } from "@angular/fire/auth";
import {  FormControl,FormGroup,NgForm,Validators,FormBuilder, NgModelGroup,} from "@angular/forms";
import * as firebase from "firebase";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs';
import { finalize, mergeScan } from 'rxjs/operators';
import { Key } from 'protractor';
import { error, info } from 'console';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  userInfoList: UserI[];
  misTagsList: any[] = [];
  misLibrosList: any[] = [];
  contactAdded: boolean = false;
  contactGroup: boolean = false;
  ListoImagen: boolean = false;
  AddToGroup: string;
  ImageSelected: string;
  registerList: UserI[];
  Currentimg: string;
  CurrentDescription: string;
  UserName: string;
  UserLastName: string;
  FulName: string;
  register = [];
  itemRef: any;
  Activechat: any;
  Addinfo: string;
  AreAllMembers: boolean = false;
  integrants: string[] = [];
  NameGroup: string;
  CurrentGroupimg: string;
  KeyGroup: any;
  copyKey: any;
  dBlock: string[] = [];
  Mail: string = "";

  ngFormProfile = new FormGroup({
    descripcion: new FormControl(),      
  });

  constructor( 
    public authService: AuthService,
    public chatService: ChatService,
    private firebaseAuth: AngularFireAuth,
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService) 
    { }

    async ngOnInit(){
      this.UserAcount();      
  
      this.registerService
        .getRegister()
        .snapshotChanges()
        .subscribe((item) => {
          this.registerList = [];
          item.forEach((element) => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.registerList.push(x as UserI);

          });        
        });
      
      //  await this.PrintConsistance();
      //  await this.UpdatePerfilPhoto();
      //  await this.WhoIsWritingMe();
      //  await this.SearchImg();
    }

  goToHome() {
    this.router.navigate(['/home']);
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async  doLogout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  UserAcount() {
    // var user = this.firebaseAuth.auth.currentUser;
    let $this = this;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.

        if (user != null) {
          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            // console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            // console.log("  Phone Number: " + profile.photoURL);
            $this.UpdatePerfilPhoto(profile.email);
            $this.getNameUser(profile.email);
            $this.getDescriptionUser(profile.email);
            $this.getMisLibros();
            $this.getMisTags();
          });
        }
        console.log(user);
      } else {
        // No user is signed in.
      }
    });
  }

  //---------------------------------------------------INIT DROP ZONE--------------------------------------------------------  
  fileUrl: string;
  ImgUrl:  string;
  ImgGUrl:  string;

  getUrl(event){
    this.fileUrl = event;
    console.log("URL recibida en padre: " + this.fileUrl);
  }

  async getImg(event){
    this.ImgUrl = event;
    const Email = firebase.auth().currentUser.email;
    console.log("URL recibida en padre: " + this.ImgUrl);
   await this.SendImage();
   await this.UpdatePerfilPhoto(Email);
  }

  

  // async getGroupImg(event){
  //   this.ImgGUrl = event;
  //   console.log("URL recibida en padre: " + this.ImgGUrl);
  //  await this.groupImage();
  // }

  async SendImage (){
    // console.log("ENTRE MANASO");

    if(this.ImgUrl){
      let Key;      
      const Email = firebase.auth().currentUser.email;
      console.log("Email de sendimage");
      console.log(Email);
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            console.log("entramos", childKey);
            console.log("recorrido", childKey);
          }
                   
        });
      });

      this.firebase.database.ref("registers").child(Key).child("Images").push({
        ImgUrl: this.ImgUrl
      });
      
      this.toastr.success('Photo subida', 'Exitosamente');
    }
  }

  //-----------------------------------------------------Update perfil photo----------------------------------------------

  async UpdatePerfilPhoto(Mail){

    let Key;
    // firebase.auth().currentUser.email
    const Email = Mail;
    // await Email = firebase.auth().currentUser.email;
    console.log("Email UpdatePerfilPhoto");
    console.log(Email);
    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();     
        if (childData.email == Email) {
          Key = childKey;
          user.forEach((info) => {
            info.forEach((Images) => {
              Images.forEach((ImgUrl) => {
                const ImagesChildKey = ImgUrl.key;
                const ImagesChildData = ImgUrl.val();
                const filter = /https:/gm;

                if (ImagesChildKey == "ImgUrl"){
                  this.Currentimg = ImagesChildData;
                } 
              });
            });
          });
        }
      });
    });

    if(!this.Currentimg) {
      this.Currentimg = "../../../../../../assets/img/NoImage.png";
      const query: string = ".container .Photoimg";
      const Photoimg: any = document.querySelector(query);
      // const query2: string = "#app .profile";
      // const profile: any = document.querySelector(query2);
      Photoimg.src = this.Currentimg;
      // profile.src = this.Currentimg;
      console.log(Photoimg.src);
      // console.log(profile.src);
      // console.log(profile.src);
    } else {
      const query: string = ".container .Photoimg";
      const Photoimg: any = document.querySelector(query);
      // const query2: string = "#app .profile";
      // const profile: any = document.querySelector(query2);
      Photoimg.src = this.Currentimg;
      // profile.src = this.Currentimg;
      console.log(this.Currentimg);      
    }
    
  }
  //-----------------------------------------------------End Update perfil photo--------------------------------------

 //-----------------------------------------------------Search IMg----------------------------------------------  
//   async SearchImg(){

//     let Key;
//     let ContactNumber = this.FormAdd.controls.Numbercontact.value;


//     await this.firebase.database.ref("registers").once("value", (users) => {
//       users.forEach((user) => {
//         const childKey = user.key;
//         const childData = user.val();
//  // PRIMERA PASADA PARA RECORRER PRIMERA CAPA       
//         if (childData.email == ContactNumber || childData.telefono.e164Number == ContactNumber) {
//           Key = childKey;
//           // SEGUNDA PASADA PARA RECORRER DENTRO DEL USUARIO
//           user.forEach((info) => {
//             const infoChildKey = info.key;
//             const infoChildData = info.val();
//             // SEGUNDA PASADA PARA RECORRER DENTRO DE CONTACTS
//             info.forEach((Images) => {
//               const imagesChildKey = Images.key;
//               const imagesChilData = Images.val();
//               // SEGUNDA PASADA PARA RECORRER LOS NUMERO Y NOMBRE
//               Images.forEach((ImgUrl) => {
//                 const ImagesChildKey = ImgUrl.key;
//                 const ImagesChildData = ImgUrl.val();
//                 const filter = /https:/gm;

//                 if (ImagesChildKey == "ImgUrl"){
//                   this.ImageSelected = ImagesChildData;
//                 }
                
//               });
//             });
//           });
//         }
//       });
//     });
//     return this.ImageSelected;
//   }
//-----------------------------------------------------ENd Search IMg----------------------------------------------
//-----------------------------------------------------Start get name----------------------------------------------

  async getNameUser(Mail){

    let Key;
    // firebase.auth().currentUser.email
    const Email = Mail;
    console.log("name getNameUser");
    console.log(Email);
    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();     
        if (childData.email == Email) {
          Key = childKey;
          console.log("childData");
          console.log(childData);
          if (childData.lname != '' && childData.name != ''){
            this.UserName = childData.name;
            this.UserLastName = childData.lname;            
            this.FulName = this.UserName.concat(" "+this.UserLastName);
          }          
        }
      });
    });

    if(this.UserName != '') {
      
      const query: string = ".container .name";
      document.querySelector(query).innerHTML = this.FulName;

    } else {
      const query: string = ".container .name";
      document.querySelector(query).innerHTML = "Nombre no registrado";
      this.toastr.error('Error al buscar el nombre', 'Error');   
    }
    
  }
  //-----------------------------------------------------End get name----------------------------------------------
  //-----------------------------------------------------Start Send descrition------------------------------------------
  async SendDescription (){
    const query: string = ".container .inputDescripcion";
    const Descript: any = document.querySelector(query);
    const Description = Descript.value;
    console.log("Description");
    console.log(Description);
    if(Description != ''){
      let Key;      
      const Email = firebase.auth().currentUser.email;
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            console.log("entramos", childKey);
            console.log("recorrido", childKey);
          }
                   
        });
      });
  
      this.firebase.database.ref("registers").child(Key).child("Descripcion").push({
        Descripcion: Description
      });
      
      this.toastr.success('Descripcion actualizada', 'Exitosamente');
    }
  }
  //-----------------------------------------------------END Send descrition------------------------------------------
  //-----------------------------------------------------Start Get descrition------------------------------------------
  async getDescriptionUser(Mail){

    let Key;
    // firebase.auth().currentUser.email
    const Email = Mail;
    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();     
        if (childData.email == Email) {
          Key = childKey;
          user.forEach((info) => {
            info.forEach((Description) => {
              Description.forEach((DescriptionText) => {
                const DescriptionChildKey = DescriptionText.key;
                const DescriptionChildData = DescriptionText.val();

                if (DescriptionChildKey == "Descripcion"){
                  this.CurrentDescription = DescriptionChildData;
                } 
              });
            });
          });         
        }
      });
    });

    if(this.CurrentDescription != '') {
      
      const query: string = ".inputDescripcion";
      const element: any  = document.querySelector(query);
      element.value = this.CurrentDescription;

    }
    const query: string = "#descripcionID";
    const Descripcion: any = document.querySelector(query);
    let DescripcionValue = Descripcion.value

    if (DescripcionValue == 'undefined'){
      DescripcionValue = "Ingresa tu descripción"
    }  
    
    
  }
  //-----------------------------------------------------Start get Mislibros------------------------------------------
  async getMisLibros(){
    let Key;
    let Autor = {};
    let Titulo = {};
    let Imagen = {};
    // console.log("Esto es index");
    // console.log(index);
    const Email = firebase.auth().currentUser.email;

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
                if (LibrosChildKey == "Autor"){
                  Autor = LibrosChildData;
                  // console.log(aut);
                  // this.misLibrosList.push({Autor:LibrosChildData});
                } else if (LibrosChildKey == "Imagen"){
                  Imagen = LibrosChildData;
                  // console.log(img);
                  // this.misLibrosList.push({Imagen:LibrosChildData});
                } else if (LibrosChildKey == "Titulo"){
                  Titulo = LibrosChildData;
                  // console.log(tit);
                  if (Autor != '' && Imagen != '' && Titulo != ''){
                    console.log("entre");
                    this.misLibrosList.push({Autor,Imagen,Titulo});
                  }
                }                
                });
                
              });
            });
          }        
        });
      });
      console.log(this.misLibrosList);
  }
  //-----------------------------------------------------END get Mislibros------------------------------------------
  //-----------------------------------------------------Start get MisTags------------------------------------------
  async getMisTags(){
    let Key;
    let Tags = {};
    let Titulo = {};
    let Imagen = {};
    // console.log("Esto es index");
    // console.log(index);
    const Email = firebase.auth().currentUser.email;

      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          // console.log("entre nivel1");
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            user.forEach((info) => {
              info.forEach((MisTags) => {
                MisTags.forEach((Tag) => {
                  const TagChildKey = Tag.key;
                  const TagChildData = Tag.val();
                if (TagChildKey == "Tag"){
                  Tags = TagChildData;
                  // console.log(aut);
                  // this.misTagsList.push({Tags:TagChildData});
                  if (Tags != ''){
                    console.log("entre");
                    this.misTagsList.push({Tags});
                  }
                }              
                });
                
              });
            });
          }        
        });
      });
      console.log(this.misTagsList);
  }
  //-----------------------------------------------------END get MisTags------------------------------------------
}