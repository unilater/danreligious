import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LiturgiaPage } from './liturgia.page'; // standalone

@NgModule({
  // ⛔️ niente declarations qui
  imports: [
    CommonModule,
    IonicModule,
    LiturgiaPage, // ✅ i standalone si mettono in imports, non in declarations
  ],
  // exports opzionale solo se serve usarla in template di altri moduli
  exports: [LiturgiaPage],
})
export class LiturgiaPageModule {}
