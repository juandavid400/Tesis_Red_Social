import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RegisterService } from 'src/app/shared/services/register.service';
import * as firebase from "firebase";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  fileUrl: string;
  ImgUrl:  string;
  ImgGUrl:  string;
  Currentimg: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private firebase: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    private toastr: ToastrService) { }

  viewCreateGroup = false;

  ngOnInit(): void {
  }
  

  ngForm = new FormGroup({
    name: new FormControl(),
    lname: new FormControl(),
    telefono: new FormControl(),
    email: new FormControl(),    
    password: new FormControl(),
    confirmPassword: new FormControl(),      
  });

  async getImg(event){
    this.ImgUrl = event;
    const Email = firebase.auth().currentUser.email;
   await this.SendImage();
   await this.UpdatePerfilPhoto(Email);
  }
  
  createGroup(){

  }

  searchGroup(){
    
  }
  myGroup(){
    
  }

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

}
