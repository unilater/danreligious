import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NaturaPage } from './natura.page';

const routes: Routes = [
  {
    path: '',
    component: NaturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NaturaPageRoutingModule {}
