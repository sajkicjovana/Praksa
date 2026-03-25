import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { noAuthGuard } from './guards/no-auth-guard';
import { Connections } from './components/connections/connections';
import { Routing } from './components/routing/routing';
import { authGuard } from './guards/auth-guard';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Messages } from './components/messages/messages';
import { userGuardGuard } from './guards/user-guard-guard';

export const routes: Routes = [
    {
        path:"connections",
        component:Connections,
        canActivate: [authGuard,userGuardGuard]
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
    {
        path:"routing",
        component:Routing,
        canActivate: [authGuard,userGuardGuard]
    },
    {
        path:"",
        component:Home,
    },
    {
        path:"messages",
        component:Messages,
        canActivate:[authGuard]
    },
    {
        path:"**",
        component:PageNotFound
    }

];
