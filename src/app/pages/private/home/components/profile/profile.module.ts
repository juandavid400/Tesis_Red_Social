import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../footer/footer.component';




@NgModule({
  declarations: [
    ProfileComponent,    
    NavigationBarComponent,
    FooterComponent
   ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
})
export class ProfileModule { }
