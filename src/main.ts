import { bootstrapApplication } from '@angular/platform-browser';
import { AngularSlickgridComponent, GridOption } from 'angular-slickgrid';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
