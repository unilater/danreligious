import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DettagliosantoPage } from './dettagliosanto.page';

const routes: Routes = [
  {
    path: '',
    component: DettagliosantoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DettagliosantoPageRoutingModule {}
