import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
    router: Router = inject(Router);
  isLogged() {
    return localStorage.getItem("token") != null;
  }
  Logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
}
