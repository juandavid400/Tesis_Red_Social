// import { MessageI } from './../../../pages/private/home/interfaces/MessageI';
//import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  //socket: any;

  constructor() { }

  connect() {

    // return new Observable(observer => {
    //   this.socket = io('http://localhost:3000');
    //   this.socket.on('connect', () => {
    //     observer.next();
    //   })
    // })
  }

  // getNewMsgs() {
  //   return new Observable(observer => {
  //     this.socket.on("newMsg", msg => {
  //       observer.next(msg);
  //     });
  //   });
  // }

  // sendMsg(msg: MessageI) {
  //   this.socket.emit('newMsg', msg);
  // }

  // disconnect() {
  //   this.socket.disconnect();
  //   console.log("Se ha desconectado el usuario"+this.socket.id)
  // }


}

//Asegurando main
//realizando el merge con el main