import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  router: Router = inject(Router);
  isLogged() {
    return localStorage.getItem("token") != null;
  }
  Logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
}
