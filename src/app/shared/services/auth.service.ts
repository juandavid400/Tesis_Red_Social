import { Injectable } from '@angular/core';
import { UserI } from '../interfaces/UserI';
import { Router } from  "@angular/router";
import { RegisterComponent } from 'src/app/pages/public/register/register.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() {  }

 

  logout() {
    window.localStorage.clear();
    window.location.href = '';
  }
}
