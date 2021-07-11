import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FooterComponent } from './components/footer/footer.component';




@NgModule({
  declarations: [
    HomeComponent,    
    NavigationBarComponent,
    FooterComponent
   ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
})
export class HomeModule { }
