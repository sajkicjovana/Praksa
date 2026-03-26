// import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideRouter(routes)
//   ]
// };
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
// import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConnectionsMockInterceptor } from './mock-api/connections/connections-mock.interceptor';
import { RoutingMockInterceptor } from './mock-api/routing/routing-mock.interceptor';
import { AuthMockInterceptor } from './mock-api/auth/auth-mock.interceptor';
import { loadingInterceptor } from './interceptors/loading-interceptor';
export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide:HTTP_INTERCEPTORS,
            useClass:loadingInterceptor,
            multi:true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ConnectionsMockInterceptor,
            multi: true,
        },
        { 
            provide: HTTP_INTERCEPTORS,
            useClass: RoutingMockInterceptor,
            multi: true 
        },

        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthMockInterceptor,
            multi: true,
        },
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes)
    ],
};