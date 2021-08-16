import { FileUploadComponent } from './file-upload/file-upload.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from "@angular/common";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';

//firebase
//import { AngularFireModule} from 'angularfire2';
import { AngularFireModule} from '@angular/fire';
//import { AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFireDatabaseModule} from '@angular/fire/database';
import { environment } from '../environments/environment';
//import { AngularFirestoreModule, AngularFirestore }    from 'angularfire2/firestore';
import { AngularFirestoreModule, AngularFirestore }    from '@angular/fire/firestore';
//import { AngularFireStorageModule, AngularFireStorage }    from 'angularfire2/storage';
import { AngularFireStorageModule, AngularFireStorage }    from '@angular/fire/storage';
// import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuthModule } from '@angular/fire/auth';


//Servicios
import { RegisterService} from '../app/shared/services/register.service';
import { from } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './shared/services/auth.service';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { TagsComponent } from './pages/public/tags/tags.component';
import { FilterTagsPipe } from './pipes/filter-tags.pipe';
import { HomeComponent } from './pages/private/home/home.component';
import { ProfileComponent } from './pages/private/profile/profile.component';
import { NavigationBarComponent } from './pages/private/navigation-bar/navigation-bar.component';
import { FooterComponent } from './pages/private/footer/footer.component';
import { filter } from 'rxjs/operators';
import { FilterPipe } from './pipes/filter.pipe';
import { ExternalProfilesComponent } from './pages/private/external-profiles/external-profiles.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FileUploadComponent,
    TagsComponent,
    FilterTagsPipe,
    HomeComponent,
    ProfileComponent,
    NavigationBarComponent,
    FooterComponent,
    FilterPipe,
    ExternalProfilesComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    NgxIntlTelInputModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })
  ],
  providers: [
    RegisterService,
    RegisterComponent,
    AuthService,
    AngularFirestore,
    AngularFireAuthGuard,
    FilterTagsPipe,
    FilterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
