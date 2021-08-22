import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private router:Router,) { }

  ngOnInit(): void {
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToGroups() {
    this.router.navigate(['/groups']);
  }

  goToExternalProfiles() {
    this.router.navigate(['/externalProfiles']);
  }
  

}
