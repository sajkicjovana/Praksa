import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LoginRequest } from '../../mock-api/auth/auth.model';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  error='';
  private auth = inject(AuthService);
  router: Router = inject(Router);


  formModel = {
    email: '', password: ''
  } 
  isLogged() {
    return localStorage.getItem("token") != null;
  }
  Logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
  
  onSubmit(form:any) {
    // console.log(form)


    if (!form.valid) return;
    // console.log("uslo");
    // console.log("email:",this.formModel.email)
    // console.log("Passs:",this.formModel.password)
      const dto = {
        email: this.formModel.email,
        password: this.formModel.password
      }
      // console.log(dto)
      console.log("posle dto");
      this.auth.login(dto).subscribe({
        next: res => { console.log("loginUspesan");
          localStorage.setItem("token", res.token);

          this.router.navigate(['./connections']);
        },
        error:err => {
          console.log("greska");
          this.error = err.error?.error || "Login failed";
        }
      })
  }
}
