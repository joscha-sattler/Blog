import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './auth/login/login.component';
import { StoryboardComponent } from './storyboard/storyboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';



const routes: Routes = [

  { path: '',               component: LoginComponent},
  { path: 'register',       component: RegisterComponent},
  { path: 'login',          component: LoginComponent},
  { path: 'storyboard',     component: StoryboardComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId',   component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post-erstellen', component: PostCreateComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
