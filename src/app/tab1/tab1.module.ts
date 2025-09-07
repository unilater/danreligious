import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';   // *ngIf, *ngFor
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [
    IonicModule,          // componenti Ion (ion-note, ion-card, ecc.)
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page]  // ⬅️ DICHIARATO (non importato)
})
export class Tab1PageModule {}
