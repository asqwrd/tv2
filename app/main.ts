
//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { platformBrowser } from '@angular/platform-browser';
//import { AppModule } from './app.module';
import { AppModuleNgFactory } from './app.module.ngfactory';
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
