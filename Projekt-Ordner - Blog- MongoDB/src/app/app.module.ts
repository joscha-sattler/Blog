import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';

import { AppRoutingModule }                 from './app-routing.module';
import { AppComponent }                     from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS }  from '@angular/common/http';

import { AuthInterceptor }                  from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

// Angular Material

import { MatInputModule }        from '@angular/material/input';
import { MatCardModule }         from '@angular/material/card';
import { MatButtonModule }       from '@angular/material/button';
import { MatToolbarModule }      from '@angular/material/toolbar';
import { MatExpansionModule }    from '@angular/material/expansion';
import { MatPaginatorModule }    from '@angular/material/paginator';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';


// eigene Components

import { RegisterComponent }    from './auth/register/register.component';
import { LoginComponent }       from './auth/login/login.component';

import { MainNavComponent }     from './main-nav/main-nav.component';

import { PostCreateComponent }  from './posts/post-create/post-create.component';
import { PostListComponent }    from './posts/post-list/post-list.component';
import { StoryboardComponent }  from './storyboard/storyboard.component';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LoginComponent,
    RegisterComponent,
    StoryboardComponent,
    PostCreateComponent,
    PostListComponent,
    ErrorComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
