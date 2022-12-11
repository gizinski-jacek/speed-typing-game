import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { RoundToDecimalPipe } from './pipes/round-to-decimal.pipe';
import { InputCheckPipe } from './pipes/input-check.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    RoundToDecimalPipe,
    InputCheckPipe,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
