import { RegisterComponent } from './../register/register.component';
import { Component, Input, OnInit} from '@angular/core';
import { RegisterService } from 'src/app/shared/services/register.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import * as firebase from "firebase";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  tagsList: any[] = [];


  constructor(
    private firebaseAuth: AngularFireAuth,
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService,
    private registerComponent: RegisterComponent) { }

  ngOnInit(): void {
    this.UserAcount();
    this.registerService.getTags()
      .snapshotChanges().subscribe(item => {
        this.tagsList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.tagsList.push(x as UserI);
        });
        this.tagsList = Object.keys(this.tagsList[0]).map((key) => [this.tagsList[0][key]]);
        // var arr = Object.keys(rango[1]).map((key) => [(key), rango[1][key]]);
        console.log(this.tagsList);
      });
      
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
          });
        }
        console.log(user);
      } else {
        // No user is signed in.
      }
    });
  }

  

  //-----------------------------------------------------Start Send tags------------------------------------------
  async sendTags (i){
    let index = i.split("-");
    console.log(i);
    const query: string = "#categoria"+index[1];
    const tag: any = document.querySelector(query);
    const Tags = tag.textContent;
    let query2: string = "#tags"+index[1];
    let image: any = document.querySelector(query2);
    image.src = "../../../../assets/img/checkIcon.svg";
    console.log("Tag");
    console.log(Tags);
    if(Tags != ''){
      let Key;      
      const Email = firebase.auth().currentUser.email;
      console.log(Email);
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
          }
                   
        });
      });
  
      this.firebase.database.ref("registers").child(Key).child("Tags").push({
        Tag: Tags
      });
      
      this.toastr.success('Tag '+Tags+' agregado', 'Exitosamente');
    }
  }
  //-----------------------------------------------------END Send tags------------------------------------------
  

}
