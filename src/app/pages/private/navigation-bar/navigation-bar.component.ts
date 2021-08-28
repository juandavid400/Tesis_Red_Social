import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  public isCollapsed=true;
  
  constructor(private router:Router,public authService: AuthService) { }

  ngOnInit(): void {
  }

  async  doLogout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  // goToProfile() {
  //   this.router.navigate(['/profile']);
  // }

}
