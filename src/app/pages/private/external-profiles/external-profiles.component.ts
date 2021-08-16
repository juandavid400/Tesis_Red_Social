import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { RegisterService } from "src/app/shared/services/register.service";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AngularFireAuth } from '@angular/fire/auth';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-external-profiles',
  templateUrl: './external-profiles.component.html',
  styleUrls: ['./external-profiles.component.scss']
})
export class ExternalProfilesComponent implements OnInit {

  constructor(public authService: AuthService,
    public chatService: ChatService,
    private firebaseAuth:AngularFireAuth, 
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService,
    private filter: FilterPipe) { }

    registerList: UserI[];
    imgUser: any[] = [];
    registerListNew: any[] = [];
    arr: any[] = [];

  ngOnInit(): void {
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
        console.warn("this.registerList");
        console.log(this.registerList);
        this.registerListNew = Object.values(this.registerList);
        // for (let i = 0; i < arr.length; i++) {
        //   for (let j = 0; j < arr[i].length; j++) {
        //     this.registerListNew.push(arr[i][j]);     
        //   }
        // }
        $this.getImgUsers(this.registerListNew);
        
      });
  }

  UserAcount (){    
    let $this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        
        if (user != null) {
          user.providerData.forEach(function (profile) {
            // console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            // console.log("  Name: " + profile.displayName);
            // console.log("  Email: " + profile.email);
            // $this.addBookToUser(profile.email,"");
          });
        }
      } else {
        // No user is signed in.
      }
    });
  }

  async  doLogout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  getImgUsers(arrList){
    let $this = this;
    const Email = firebase.auth().currentUser.email;
    let Key;
    let entries;
    let email;
    const filter = '@';
    
    setTimeout(function(){ 

      for (let i = 0; i < arrList.length; i++) {

        entries = Object.values(arrList[i]);
        for (let j = 0; j < entries.length; j++) {
          if (typeof entries[j] != 'object'){
            if (entries[j].match(filter)) {
            
              email = entries[j];
               $this.firebase.database.ref("registers").once("value", (users) => {
                users.forEach((user) => {
                  const childKey = user.key;
                  const childData = user.val();     
                  if (childData.email == email) {
                    Key = childKey;
                    user.forEach((info) => {
                      info.forEach((Images) => {
                        Images.forEach((ImgUrl) => {
                          const ImagesChildKey = ImgUrl.key;
                          const ImagesChildData = ImgUrl.val();
          
                          if (ImagesChildKey == "ImgUrl"){
                            $this.imgUser.push(ImagesChildData);
                          } 
                        });
                      });
                    });
                  }
                });
              });
            }
          }
                  
        }
        console.log("$this.imgUser");
        console.log($this.imgUser);
        
        if ($this.imgUser != undefined){
          if ($this.imgUser.length >= 1){
            let lastImg = $this.imgUser[$this.imgUser.length - 1];
            let query: string = "#imagen"+i;
            let Userimg: any = document.querySelector(query);
            Userimg.src = lastImg;
          } else {
            let lastImg = $this.imgUser[0];
            let query: string = "#imagen"+i;
            let Userimg: any = document.querySelector(query);
            Userimg.src = lastImg;
          }  
        } else{
        
          let lastImg = "../../../../../../assets/img/NoImage.png";
          let query: string = "#imagen"+i;
          let Userimg: any = document.querySelector(query);
          Userimg.src = lastImg;
        }
      }

     }, 500);
    
    this.imgUser = [];
  }

  async addFriend(index){
    let Key;
    let contador = 0;
    let confirm = false;
    const Email = firebase.auth().currentUser.email;

    let correoAmigo = document.querySelector("#correo"+index);         
    let correoAmigoText = correoAmigo.textContent;
    
    let nombreAmigo = document.querySelector("#nombre"+index);         
    let nombreAmigoText = nombreAmigo.textContent;

      // console.log(this.autor);
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          // console.log("entre nivel1");
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            user.forEach((info) => {
              info.forEach((Amigos) => {
                Amigos.forEach((misAmigos) => {
                  const misAmigosChildKey = misAmigos.key;
                  const misAmigosChildData = misAmigos.val();
                if (misAmigosChildKey == "Contacto"){
                    this.arr.push(misAmigosChildData);                  
                }
                });
                
              });
            });
          }        
        });
      });
      console.log(this.arr);
      if (this.arr==undefined){
        this.firebase.database.ref("registers").child(Key).child("Amigos").push({
          Contacto: correoAmigoText,
          Nombre: nombreAmigoText
        });
        this.toastr.success('Amigo añadido a tu lista', 'Exitosamente');
      } else{
        for (let i = 0; i < this.arr.length; i++) {
          if (this.arr[i]==correoAmigoText){
            contador ++;
          }        
        }
        if (contador==0){
          confirm = true;
        } else {
          this.toastr.error('Esta persona ya se encuentra en tu lista', 'Fallido');
        }
        if (confirm == true){
          this.firebase.database.ref("registers").child(Key).child("Amigos").push({
            Contacto: correoAmigoText,
            Nombre: nombreAmigoText
          });
          this.toastr.success('Amigo añadido a tu lista', 'Exitosamente');
        }
      }
         
  }
}
