
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { GLComponent } from 'src/app/gl.component';
import { AppComponent } from 'src/app/app.component';
import { App2Component } from 'src/app/app2.component';
import { AppService } from './app.service';

@NgModule({
  imports:          [ BrowserModule, FormsModule ],
  declarations:     [ GLComponent, AppComponent, App2Component ],
  providers:        [ AppService ],
  bootstrap:        [ GLComponent ]
})

export class AppModule {}
