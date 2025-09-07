// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'messa/:date',
    loadComponent: () => import('./pages/messa/messa.page').then(m => m.MessaPage)
  },
  { path: '', redirectTo: '/tabs/tab1', pathMatch: 'full' },
  { path: '**', redirectTo: '/tabs/tab1' },

{
  path: 'santo/:date',
  loadComponent: () => import('./pages/dettagliosanto/dettagliosanto.page').then(m => m.DettagliosantoPage)
}


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
