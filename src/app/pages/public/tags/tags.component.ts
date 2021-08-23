import { RegisterComponent } from './../register/register.component';
import { Component, OnInit} from '@angular/core';
import { RegisterService } from 'src/app/shared/services/register.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as firebase from "firebase";
import { element } from 'protractor';



@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  tagsList: any[] = [];
  tagsListNew: any[] = [];
  tagsValidate: any[] = [];
  validate: any[] = [];
  tags: any[] = [];
  searchBoxTag= '';
  Key = '';
  confirm: any = false;
  contador: number= 0;
  name = '';
  

  constructor(
    private firebaseAuth: AngularFireAuth,
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService,
    private registerComponent: RegisterComponent) { }

    goToHome() {
      this.router.navigate(['/home']);
    }

  ngOnInit(): void {
    let $this = this;
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
        for (let i = 0; i < this.tagsList.length; i++) {
          this.tagsListNew.push({Categoria: this.tagsList[i][0]});     
        }
        for (let i = 0; i < this.tagsList.length; i++) {
          this.validate.push(this.tagsList[i][0]);     
        }        
        
        setTimeout(function(){ $this.validateTags(); }, 500);
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
            // console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            // console.log("  Name: " + profile.displayName);
            // console.log("  Email: " + profile.email);
            // console.log("  Phone Number: " + profile.photoURL);
          });
        }
        // console.log(user);
      } else {
        // No user is signed in.
      }
    });
  }


  //-----------------------------------------------------Start Send tags------------------------------------------
  async sendTags (i){
    let index = i.split("-");
    let query: string = "#categoria"+index[1];
    let query2: string = ".tagscont";
    let query3: string = "#key"+index[1];
    let tag: any = document.querySelector(query);
    let container: any = document.querySelector(query2);
    let keytag: any = document.querySelector(query3);
    let Tags = tag.textContent;
    this.name = Tags;   
    
    if(Tags != ''){
            
      const Email = firebase.auth().currentUser.email;
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          // console.log("entre nivel1");
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            this.Key = childKey;
            user.forEach((info) => {
              info.forEach((MisTags) => {
                MisTags.forEach((Tags) => {
                  const TagsChildKey = Tags.key;
                  const TagsChildData = Tags.val();
                if (TagsChildKey == "Tag"){
                  if (TagsChildData == this.name){
                    this.tags.push(TagsChildData);
                  }
                }
                });
                
              });
            });
          }        
        });
      });

      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i]==Tags){
          this.contador ++;
        }        
      }
      if (this.contador==0){
        this.confirm = true;
      } else {
        this.toastr.error('El tag ya se encuentra en tu lista', 'Fallido');
      }
      if (this.confirm == true){

        if(keytag.value == null || keytag.value == ""){
          
          this.firebase.database.ref("registers").child(this.Key).child("Tags").push({
            Tag: Tags
          });
          this.toastr.success('Tag '+Tags+' agregado', 'Exitosamente');
          let query2: string = "#tags"+index[1];
          let image: any = document.querySelector(query2);
          image.src = "../../../../assets/img/checkIcon.svg";   
        } 
        // else{
        //   this.productService.updateProduct(productForm.value);
        // }
           
        // container.style.display = 'none';
      }      
    }
    this.confirm = false;
    this.contador = 0;
    this.tags= [];
  }
  //-----------------------------------------------------END Send tags------------------------------------------

  async validateTags (){   
      const Email = firebase.auth().currentUser.email;
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          // console.log("entre nivel1");
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            this.Key = childKey;
            user.forEach((info) => {
              info.forEach((MisTags) => {
                MisTags.forEach((Tags) => {
                  const TagsChildKey = Tags.key;
                  const TagsChildData = Tags.val();
                if (TagsChildKey == "Tag"){
                  this.tagsValidate.push(TagsChildData);                  
                }
                });
                
              });
            });
          }        
        });
      });

      let arr: any[] = [];
      for (let i = 0; i < this.validate.length; i++) {
        for (let j = 0; j < this.tagsValidate.length; j++) {
          if (this.validate[i]==this.tagsValidate[j]){
            let query2: string = "#tags"+i;
            let image: any = document.querySelector(query2);
            console.log("image");
            console.log(image);
            image.src = "../../../../assets/img/checkIcon.svg"; 
          }
                 
        }
        
      }
  }

}
