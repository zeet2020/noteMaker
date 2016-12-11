import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PostService } from './post.service';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { PostlistComponent } from './postlist/postlist.component';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PostlistComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ 
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
