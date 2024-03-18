import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InstructionsComponent } from './components/instructions';
import { UserBirdsComponent } from './components/user-birds/user-birds.component';



const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'instructions', component: InstructionsComponent},
  { path: 'user-birds', component: UserBirdsComponent},

  //redirect to home
  { path: '**', redirectTo: ''}
];
/* @NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
}) */
export const AppRoutingModule = RouterModule.forRoot(routes);




