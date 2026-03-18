import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { noAuthGuard } from './guards/no-auth-guard';
import { Connections } from './components/connections/connections';

export const routes: Routes = [
    {
        path:"connections",
        component:Connections,
    },
    {
        path:"login",
        component:Login,
        canActivate:[noAuthGuard],
    },
    {
        path:"register",
        component:Register,
        canActivate:[noAuthGuard],
    },
    

];
