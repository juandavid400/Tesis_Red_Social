import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { RegisterService } from "src/app/shared/services/register.service";
import { UserI } from 'src/app/shared/interfaces/UserI';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import {  FormControl, FormGroup, NgForm, Validators, FormBuilder,} from "@angular/forms";
import * as firebase from 'firebase';
import { Router } from '@angular/router';
//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

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

  chats: Array<ChatI> = [
    {
      title: "El costeño",
      icon: "/assets/img/ca.jpeg",
      isRead: true,
      msgPreview: "como gallinazo",
      lastMsg: "11:13",
      msgs: [
        {content: "a lo que se mueva", isRead:true, isMe:true, time:"7:24"},
        {content: "entonces ando de gallinazo", isRead:true, isMe:false, time:"7:25"},
      ]
    },
    {
      title: "El traumado",
      icon: "/assets/img/tr.jpg",
      isRead: true,
      msgPreview: "Suerte es que le deseo, haga eso pi**",
      lastMsg: "18:30",
      msgs: [
        {content: "Suerte es que le deseo, haga eso pi**", isRead:true, isMe:true, time:"9:24"},
        {content: "obligueme perro", isRead:true, isMe:false, time:"9:25"},
      ]

    },
    {
      title: "Solos Pobres y FEOS",
      icon: "/assets/img/td.jpeg",
      isRead: true,
      msgPreview: "Nice front 😎",
      lastMsg: "23:30",
      msgs: []
    },
    {
      title: "El de la moto",
      icon: "/assets/img/go.jpg",
      isRead: true,
      msgPreview: " 😎",
      lastMsg: "3:30",
      msgs: []
    },
    {
      title: "El charlon",
      icon: "/assets/img/al.PNG",
      isRead: true,
      msgPreview: " 😎",
      lastMsg: "8:30",
      msgs: []
    },
  ];

  currentChat = {
    title: "",
    icon: "",
    msgs: []
  };

  constructor(public authService: AuthService, public chatService: ChatService, private firebaseAuth:AngularFireAuth, 
    private registerService: RegisterService, private router: Router, private firebase: AngularFireDatabase) {}

    registerList: UserI[];
    register= [];
    itemRef: any;

    ngOnInit(): void {
      // this.initChat();
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
    }

    UserAcount (){
      // var user = this.firebaseAuth.auth.currentUser;
  
      firebase.auth().onAuthStateChanged(function(user) {
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

  ngOnDestroy(): void {
    this.destroySubscriptionList();
    // this.chatService.disconnect();
  }

  // initChat() {
  //   if (this.chats.length > 0) {
  //     this.currentChat.title = this.chats[0].title;
  //     this.currentChat.icon = this.chats[0].icon;
  //     this.currentChat.msgs = this.chats[0].msgs;
  //   }
  //   this.subscriptionList.connection = this.chatService.connect().subscribe(_ => {
  //     console.log("Nos conectamos");
  //     this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: MessageI) => {
  //       msg.isMe = this.currentChat.title === msg.owner ? true : false;
  //       this.currentChat.msgs.push(msg);
  //     });
  //   });
  // }

  onSelectInbox(index: number) {
    this.currentChat.title = this.chats[index].title;
      this.currentChat.icon = this.chats[index].icon;
      this.currentChat.msgs = this.chats[index].msgs;
  }

  async  doLogout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  destroySubscriptionList(exceptList: string[] = []): void {
    for (const key of Object.keys(this.subscriptionList)) {
      if (this.subscriptionList[key] && exceptList.indexOf(key) === -1) {
        this.subscriptionList[key].unsubscribe();
      }
    }
  }

  addcontact(){
    const query: string = '#app .addcontact';
    const addcontact: any = document.querySelector(query);
    
    if (this.count == 0) {
      this.count = 1;
      addcontact.style.left = 0;
    } else {
      this.count = 0;
      addcontact.style.left = "-100vh";
    }
  }

  

  count : number = 0;

  PerfilPhoto(){
    const query: string = '#app .PerfilPhoto';
    const PerfilPhoto: any = document.querySelector(query);
    
    if (this.countPhoto == 0) {
      this.countPhoto = 1;
      PerfilPhoto.style.left = 0;
    } else {
      this.countPhoto = 0;
      PerfilPhoto.style.left = "-100vh";
    }
  }

  countPhoto : number = 0;
  
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

  SearchAnim(){
    
  }
  

}
