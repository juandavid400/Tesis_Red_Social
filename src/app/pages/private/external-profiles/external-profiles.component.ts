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
    viewProfile = false;
    susTagsList: any[] = [];
    susLibrosList: any[] = [];
    correoExternoUser = '';
    UserName = '';
    UserLastName = '';            
    FulName = '';
    correoExt = '';
    Currentimg = '';
    searchBoxExternal= '';


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
        const Email = firebase.auth().currentUser.email;

        for (let i = 0; i < this.registerList.length; i++) {
          this.registerListNew  = Object.values(this.registerList[i]);

          for (let j = 0; j < this.registerListNew.length; j++) {            
            
            if (this.registerListNew[j]==Email) {
              this.registerList.splice(i, 1);
            }
            
          }
        }
        
        $this.getImgUsers(this.registerList);
        
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

  async getImgUsers(arrList){
    let $this = this;
    const Email = firebase.auth().currentUser.email;
    let Key;
    let entries;
    let email;
    const filter = '@';    
    console.warn("arrList");
    console.log(arrList);

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

    let imagenAmigo: any = document.querySelector("#imagen"+index);         
    let imagenAmigoSrc = imagenAmigo.src;

    if (correoAmigoText != ''){
      this.correoExternoUser = correoAmigoText;
    }

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
          NombreAmigo: nombreAmigoText,
          ImagenAmigo: imagenAmigoSrc
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
            NombreAmigo: nombreAmigoText,
            ImagenAmigo: imagenAmigoSrc
          });
          this.toastr.success('Amigo añadido a tu lista', 'Exitosamente');
        }
      }
         
  }

  async addFriendInsidePerfil(){
    let Key;
    let contador = 0;
    let confirm = false;
    const Email = firebase.auth().currentUser.email;

      // Verificar si ya esta agregado
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
      
      if (this.arr==undefined){
        this.firebase.database.ref("registers").child(Key).child("Amigos").push({
          Contacto: this.correoExt,
          NombreAmigo: this.FulName,
          ImagenAmigo: this.Currentimg
        });
        this.toastr.success('Amigo añadido a tu lista', 'Exitosamente');
      } else{
        for (let i = 0; i < this.arr.length; i++) {
          if (this.arr[i]==this.correoExt){
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
            Contacto: this.correoExt,
            NombreAmigo: this.FulName,
            ImagenAmigo: this.Currentimg
          });
          this.toastr.success('Amigo añadido a tu lista', 'Exitosamente');
        }
      }
         
  }

  gotoExternalProfile(){
    this.viewProfile = false;
    this.getImgUsers(this.registerList);
  }

  async viewExternalProfile(correoExternoUser){
    // let correoName = correoExternoUser.split("-");
    this.viewProfile = true;
    let $this = this;
    this.correoExt = correoExternoUser;
    let CurrentDescription;
    let Autor;
    let Imagen;
    let Titulo;
    let keyTAGS;
    let Tags = {};

    let Key;
    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();     
        if (childData.email == correoExternoUser) {
          Key = childKey;
          if (childData.lname != '' && childData.name != ''){
            this.UserName = childData.name;
            this.UserLastName = childData.lname;            
            this.FulName = this.UserName.concat(" "+this.UserLastName);
          }
          user.forEach((info) => {
            info.forEach((Description) => {
              const pruebakey = Description.key;
              keyTAGS = pruebakey;
              Description.forEach((DescriptionText) => {
                const DescriptionChildKey = DescriptionText.key;
                const DescriptionChildData = DescriptionText.val();

                if (DescriptionChildKey == "Descripcion"){
                  CurrentDescription = DescriptionChildData;
                }
                
                if (DescriptionChildKey == "Autor"){

                  Autor = DescriptionChildData;

                } else if (DescriptionChildKey == "Imagen"){

                  Imagen = DescriptionChildData;

                } else if (DescriptionChildKey == "Titulo"){
                  Titulo = DescriptionChildData;
                  if (Autor != '' && Imagen != '' && Titulo != ''){
                    this.susLibrosList.push({Autor,Imagen,Titulo});
                  }
                }
                
                if (DescriptionChildKey == "ImgUrl"){
                  $this.Currentimg = DescriptionChildData;
                }
                
                if (DescriptionChildKey == "Tag"){
                  Tags = DescriptionChildData;
                  // console.log(aut);
                  // this.misTagsList.push({Tags:TagChildData});
                  if (Tags != ''){
                    // console.log("info key");
                    // console.log(keyTAGS);
                    this.susTagsList.push({Tags});
                  }
                }

              });
            });
          });          
        }
      });
    });
    
    setTimeout(function(){
      
      if($this.UserName != '') {
      
        const query: string = ".containerView .name";        
        // let nameInput = document.querySelector(query).innerHTML = $this.FulName;
        let nameInput = document.querySelector(query);
        nameInput.textContent = $this.FulName;
  
      } else {
        const query: string = ".containerView .name";
        document.querySelector(query).innerHTML = "Nombre no registrado";
        $this.toastr.error('Error al buscar el nombre', 'Error');   
      }

      if(!$this.Currentimg) {
        $this.Currentimg = "../../../../../../assets/img/NoImage.png";
        const query: string = ".containerView .Photoimg";
        const Photoimg: any = document.querySelector(query);
        // const query2: string = "#app .profile";
        // const profile: any = document.querySelector(query2);
        Photoimg.src = $this.Currentimg;
        // profile.src = $this.Currentimg;
      } else {
        const query: string = ".containerView .Photoimg";
        const Photoimg: any = document.querySelector(query);
        // const query2: string = "#app .profile";
        // const profile: any = document.querySelector(query2);
        Photoimg.src = $this.Currentimg;
        
        // profile.src = $this.Currentimg;     
      }

      if(CurrentDescription != '') {
      
        const query: string = ".inputDescripcion";
        const element: any  = document.querySelector(query);
        element.value = CurrentDescription;
  
      }
      const query: string = "#descripcionID";
      const Descripcion: any = document.querySelector(query);
      let DescripcionValue = Descripcion.value
  
      if (DescripcionValue == 'undefined'){
        DescripcionValue = "Ingresa tu descripción"
      } 

    }, 500);
    

     
  }

}
