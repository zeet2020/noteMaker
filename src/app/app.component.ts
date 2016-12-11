import { Component } from '@angular/core';
import {PostService} from './post.service';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ 
    PostService
  ]
})
export class AppComponent {
  title = 'app works!';
  
  constructor(private p:PostService){ }

  ngOnInit(){
      //this.p.getPost();
    
    
  }


}
