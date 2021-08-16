import { Injectable } from '@angular/core';
//import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { UserI } from "../interfaces/UserI";
import { tags } from "../interfaces/tags";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  registerList: AngularFireList<any>;
  bookList:  AngularFireList<any>;
  tagsList:  AngularFireList<any>;
  selectedTag: tags = new tags();

  constructor(private firebase: AngularFireDatabase) { }

  getRegister(){
     this.registerList = this.firebase.list('registers');
    return this.registerList;
  }

  getBooks()
  {
    this.bookList = this.firebase.list('books');
    return this.bookList;
  }

  getTags()
  {
    this.tagsList = this.firebase.list('tags');
    return this.tagsList;
  }

  deleteTag(tagkey: string,$key: string)
  {
    console.log("delete $key");
    console.log(tagkey);
    this.firebase.database.ref("registers").child($key).child("Tags").child(tagkey).remove();
  }

  deleteLibros(tagkey: string,$key: string)
  {
    console.log("delete $key");
    console.log(tagkey);
    this.firebase.database.ref("registers").child($key).child("MisLibros").child(tagkey).remove();
  }

  deleteAmigos(tagkey: string,$key: string)
  {
    console.log("delete $key");
    console.log(tagkey);
    this.firebase.database.ref("registers").child($key).child("Amigos").child(tagkey).remove();
  }

  updateUsername(register: UserI)
  {
    console.log("register.$key");
    console.log(register.$key);
    // this.registerList.update(register.$key, {
    //   name: register.name,
    // });
  }

  insertRegister(register: UserI){

    this.registerList.push({
      email: register.email,
      telefono: register.telefono,
      password: register.password,
      name: register.name,
      lname: register.lname,
      // socketID: register.socketID,      
    });
  }
}