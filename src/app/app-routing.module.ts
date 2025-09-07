// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/tabs/tab1', pathMatch: 'full' },

  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

  // Pagine fuori dalle tabs (standalone)
  {
    path: 'messa/:date',
    loadComponent: () =>
      import('./pages/messa/messa.page').then(m => m.MessaPage)
  },
  {
    path: 'liturgia/:date',
    loadComponent: () =>
      import('./pages/liturgia/liturgia.page').then(m => m.LiturgiaPage)
  },
  {
    path: 'liturgia',
    loadComponent: () =>
      import('./pages/liturgia/liturgia.page').then(m => m.LiturgiaPage)
  },
  // Metti prima la più specifica
  {
    path: 'santo/:date/:id',
    loadComponent: () =>
      import('./pages/dettagliosanto/dettagliosanto.page').then(m => m.DettaglioSantoPage)
  },
  {
    path: 'santo/:date',
    loadComponent: () =>
      import('./pages/dettagliosanto/dettagliosanto.page').then(m => m.DettaglioSantoPage)
  },
  {
    path: 'natura/:date',
    loadComponent: () =>
      import('./pages/natura/natura.page').then(m => m.NaturaPage)
  },

  // SEMPRE per ultima
  { path: '**', redirectTo: '/tabs/tab1' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
