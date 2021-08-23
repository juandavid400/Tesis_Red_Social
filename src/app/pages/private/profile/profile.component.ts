import { FilterPipe } from 'src/app/pipes/filter.pipe';
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
import { Console, error, info } from 'console';
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  userInfoList: UserI[];
  misTagsList: any[] = [];
  misLibrosList: any[] = [];
  ImageSelected: string;
  registerList: UserI[];
  Currentimg: string;
  CurrentDescription: string;
  UserName: string;
  UserLastName: string;
  FulName: string;
  misAmigosList: any[] = [];
  keyOrdenList: any[] = [];
  KeyUSER: string = "";
  keyOrdenAmigosList: any[] = [];
  keyOrdenBooksList: any[] = [];
  

  ngFormProfile = new FormGroup({
    descripcion: new FormControl(),      
  });

  constructor( 
    private _config:NgbCarouselConfig,
    public authService: AuthService,
    public chatService: ChatService,
    private firebaseAuth: AngularFireAuth,
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService,
    private filterpipe:FilterPipe) 
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
  goToTags(){
    this.router.navigate(['/tags']);
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
            // console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            // console.log("  Name: " + profile.displayName);
            // console.log("  Email: " + profile.email);
            // console.log("  Phone Number: " + profile.photoURL);
            $this.UpdatePerfilPhoto(profile.email);
            $this.getNameUser(profile.email);
            $this.getDescriptionUser(profile.email);
            $this.getMisLibros();
            $this.getMisTags();
            $this.getMisAmigos();
          });
        }
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
  }

  async getImg(event){
    this.ImgUrl = event;
    const Email = firebase.auth().currentUser.email;
   await this.SendImage();
   await this.UpdatePerfilPhoto(Email);
  }

  

  // async getGroupImg(event){
  //   this.ImgGUrl = event;
  //   console.log("URL recibida en padre: " + this.ImgGUrl);
  //  await this.groupImage();
  // }

  async SendImage (){

    if(this.ImgUrl){
      let Key;      
      const Email = firebase.auth().currentUser.email;

      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
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

    const Email = Mail;

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
    } else {
      const query: string = ".container .Photoimg";
      const Photoimg: any = document.querySelector(query);
      // const query2: string = "#app .profile";
      // const profile: any = document.querySelector(query2);
      Photoimg.src = this.Currentimg;
      // profile.src = this.Currentimg;     
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
    const Email = Mail;
    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();     
        if (childData.email == Email) {
          Key = childKey;
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

    if(Description != ''){
      let Key;      
      const Email = firebase.auth().currentUser.email;
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
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
    let keyLibros;
    const Email = firebase.auth().currentUser.email;

      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {

          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            user.forEach((info) => {
              info.forEach((MisLibros) => {
                keyLibros = MisLibros.key;

                MisLibros.forEach((Libros) => {
                  const LibrosChildKey = Libros.key;
                  const LibrosChildData = Libros.val();
                if (LibrosChildKey == "Autor"){
                  this.keyOrdenBooksList.push(keyLibros);
                  Autor = LibrosChildData;
                  
                } else if (LibrosChildKey == "Imagen"){

                  Imagen = LibrosChildData;

                } else if (LibrosChildKey == "Titulo"){
                  Titulo = LibrosChildData;
                  if (Autor != '' && Imagen != '' && Titulo != ''){
                    
                    this.misLibrosList.push({Autor,Imagen,Titulo});
                  }
                }                
                });
                
              });
            });
          }        
        });
      });
      
  }
  //-----------------------------------------------------END get Mislibros------------------------------------------
  async getMisAmigos(){
    let Key;
    let NombreAmigo = {};
    let ImagenAmigo = {};
    let keyAmigos;
    const Email = firebase.auth().currentUser.email;

      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {

          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            user.forEach((info) => {
              info.forEach((misAmigos) => {
                keyAmigos = misAmigos.key;
                misAmigos.forEach((Amigos) => {
                  const AmigosChildKey = Amigos.key;
                  const AmigosChildData = Amigos.val();
                if (AmigosChildKey == "ImagenAmigo"){
                  this.keyOrdenAmigosList.push(keyAmigos);
                  ImagenAmigo = AmigosChildData;                    
                } 
                if (AmigosChildKey == "NombreAmigo"){

                  NombreAmigo = AmigosChildData;

                  if (Object.entries(NombreAmigo).length != 0 && Object.entries(ImagenAmigo).length != 0){
                    
                    
                    this.misAmigosList.push({ImagenAmigo,NombreAmigo});
                     
                  }
                }  

                });
                
              });
            });
          }        
        });
      });
  }
  //-----------------------------------------------------Start get MisTags------------------------------------------
   
  async getMisTags(){
    let Key;
    let Tags = {};
    let keyTAGS;

    const Email = firebase.auth().currentUser.email;

      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          // console.log("entre nivel1");
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            this.KeyUSER = childKey;
            user.forEach((info) => {              
              info.forEach((MisTags) => {
                const pruebakey = MisTags.key;
                keyTAGS = pruebakey;
                
                MisTags.forEach((Tag) => {
                  const TagChildKey = Tag.key;
                  const TagChildData = Tag.val();
                if (TagChildKey == "Tag"){
                  Tags = TagChildData;
                  // console.log(aut);
                  // this.misTagsList.push({Tags:TagChildData});
                  if (Tags != ''){
                    // console.log("info key");
                    // console.log(keyTAGS);
                    this.keyOrdenList.push(keyTAGS);
                    this.misTagsList.push({Tags});
                  }
                }              
                });
                
              });
            });
          }        
        });
      });
  }
  //-----------------------------------------------------END get MisTags------------------------------------------

  async deleteSth(i){
    let index = i.split("-");
    let query2: string = "#contTag"+index[1];
    let cont: any = document.querySelector(query2);
    cont.style.display = 'none';
    this.registerService.deleteTag(this.keyOrdenList[index[1]],this.KeyUSER);
    this.toastr.warning('Tag eliminado', 'Exitosamente');    
  }

  async deleteBook(i){
    let index = i.split("-");
    let query2: string = "#mislibros"+index[1];
    let cont: any = document.querySelector(query2);
    //por el carrusel no encuentra el query2
    console.log(cont);
    cont.style.display = 'none';
    
    this.registerService.deleteLibros(this.keyOrdenBooksList[index[1]],this.KeyUSER);
    this.toastr.warning('Libro eliminado', 'Exitosamente');    
  }

  async deleteFriend(i){
    let index = i.split("-");
    let query2: string = ".containerAmigos"+index[1];
    let cont: any = document.querySelector(query2);
    cont.style.display = 'none';
    this.registerService.deleteAmigos(this.keyOrdenAmigosList[index[1]],this.KeyUSER);
    this.toastr.warning('Amigo eliminado', 'Exitosamente');    
  }

  async editUserName(register: UserI){
    let variable;
    this.registerService.updateUsername(variable);
  }
}