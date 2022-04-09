import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { AddEditBillComponent } from './add-edit-bill-component/add-edit-bill.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ExpenseService } from './expense.service';
import { DecimalNumber } from './shared/directives/decimal-number.directive';

@NgModule({
  declarations: [
    AppComponent,
    AddEditBillComponent,
    DecimalNumber
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    MaterialModule
  ],
  providers: [ExpenseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
