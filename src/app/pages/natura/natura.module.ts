import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NaturaPageRoutingModule } from './natura-routing.module';

import { NaturaPage } from './natura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NaturaPageRoutingModule
  ],
  declarations: [NaturaPage]
})
export class NaturaPageModule {}
