import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DettagliosantoPageRoutingModule } from './dettagliosanto-routing.module';

import { DettagliosantoPage } from './dettagliosanto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DettagliosantoPageRoutingModule
  ],
  declarations: [DettagliosantoPage]
})
export class DettagliosantoPageModule {}
