import { ProfileComponent } from './pages/private/profile/profile.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/private/home/home.component';
// import { HomeModule } from './pages/private/home/home.module';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { TagsComponent } from './pages/public/tags/tags.component';
import { ExternalProfilesComponent } from './pages/private/external-profiles/external-profiles.component';
import { GroupComponent } from './pages/private/group/group.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectAuthorizedToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectAuthorizedToHome } },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/**', component: ProfileComponent },
  { path: 'tags', component: TagsComponent },
  { path: 'externalProfiles', component: ExternalProfilesComponent },
  { path: 'groups', component: GroupComponent},
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
