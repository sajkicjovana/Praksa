import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LoginRequest } from '../../mock-api/auth/auth.model';
import { AuthService } from '../../services/auth.services';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
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

  constructor(private snackBar: MatSnackBar){}
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
          console.log(res.token)
// console.log(localStorage.getItem('token'))
          this.snackBar.open(`Welcome ${res.name}`, 'Ok', {
          duration: 3000
        });
          this.router.navigate(['./connections']);
        },
        error:err => {
          console.log("greska");
          // console.log(err.error?.error )
          this.error = err.error?.error || "Login failed";
          // this.formModel.email='';
          // this.formModel.password='';
          console.log(this.error)
        }
      })
  }
}
