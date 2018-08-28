import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app.routing';

import {MatStepperModule} from '@angular/material/stepper';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule, MatNativeDateModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { TweetComponent } from './tweet/tweet.component';
import { NavbarComponent } from './navbar/navbar.component';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';

import { environment } from '../environments/environment';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EmbedVideo } from 'ngx-embed-video';


@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatSidenavModule,
    MatSliderModule,
    MatButtonModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatRadioModule,
    MatStepperModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatToolbarModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    EmbedVideo.forRoot(),
  ],
  exports: [
    NavbarComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
