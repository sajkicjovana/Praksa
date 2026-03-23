import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
    error='';
    private auth = inject(AuthService);
    router: Router = inject(Router);
  
  
    formModel = {
      email: '', password: '', firstname:'', lastname:''
    } 
    isLogged() {
      return localStorage.getItem("token") != null;
    }
    Logout() {
      localStorage.removeItem("token");
      this.router.navigate(["login"]);
    }
    
    onSubmit(form:any) {
      if (!form.valid) return;
      const dto = {
          email: this.formModel.email,
          password: this.formModel.password,
          name: this.formModel.firstname+" "+this.formModel.lastname,
          role:'user'
      }
        this.auth.register(dto).subscribe({
          next: res => { 
            console.log("Napravljen nalog")
            
            this.router.navigate(['./login']);
          },
          error:err => {
            console.log("Jok");
            this.error = err.error?.error || "Login failed";
          }
        })
    }
}
