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

  contactAdded: boolean = false;
  contactGroup: boolean = false;
  ListoImagen: boolean = false;
  AddToGroup: string;
  ImageSelected: string;
  registerList: UserI[];
  Currentimg: string;
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

  constructor( 
    public authService: AuthService,
    public chatService: ChatService,
    private firebaseAuth: AngularFireAuth,
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService) 
    { }

  ngOnInit(): void {
  }

  goToHome() {
    this.router.navigate(['/home']);
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
    console.log("URL recibida en padre: " + this.ImgUrl);
   await this.SendImage();
   await this.UpdatePerfilPhoto();
  }

  //-----------------------------------------------------Update perfil photo----------------------------------------------

  async UpdatePerfilPhoto(){

    let Key;
    const Email = firebase.auth().currentUser.email;
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
      this.Currentimg = "../../../../../../assets/img/noImage.png";
      const query: string = "#app .Photoimg";
      const Photoimg: any = document.querySelector(query);
      const query2: string = "#app .profile";
      const profile: any = document.querySelector(query2);
      Photoimg.src = this.Currentimg;
      profile.src = this.Currentimg;
      console.log(profile.src);
      console.log(profile.src);
      console.log(profile.src);
    } else {
      const query: string = "#app .Photoimg";
      const Photoimg: any = document.querySelector(query);
      const query2: string = "#app .profile";
      const profile: any = document.querySelector(query2);
      Photoimg.src = this.Currentimg;
      profile.src = this.Currentimg;
      console.log(this.Currentimg);      
    }
    
  }
  //-----------------------------------------------------End Update perfil photo----------------------------------------------

  // async getGroupImg(event){
  //   this.ImgGUrl = event;
  //   console.log("URL recibida en padre: " + this.ImgGUrl);
  //  await this.groupImage();
  // }

  async SendImage (){
    console.log("ENTRE MANASO");

    if(this.ImgUrl){
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

      this.firebase.database.ref("registers").child(Key).child("Images").push({
        ImgUrl: this.ImgUrl
      });
      
      this.toastr.success('Submit successful', 'Image updated');
    }
  }

  PerfilPhoto() {
    const query: string = "#app .PerfilPhoto";
    const PerfilPhoto: any = document.querySelector(query);

    if (this.countPhoto == 0) {
      this.countPhoto = 1;
      PerfilPhoto.style.left = 0;
    } else {
      this.countPhoto = 0;
      PerfilPhoto.style.left = "-100vh";
    }
  }

  countPhoto: number = 0;
}

