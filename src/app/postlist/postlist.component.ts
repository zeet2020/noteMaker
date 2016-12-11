import { Component,ElementRef, OnInit } from '@angular/core';
import { PostService } from '../post.service.ts';

declare var jQuery:any;


@Component({
  selector: 'app-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.css']
  //outputs:['vent']
})
export class PostlistComponent implements OnInit {
  list:any;
  currentPage:number = 0;
  

  constructor(private ps:PostService,private elementRef: ElementRef) {
    
      }

  ngOnInit() {
     this.ps.onDbReady(() => {

          this.list = this.ps.getPost();

     });

     
     jQuery(this.elementRef.nativeElement).find('.notelist').slimScroll({height: '575px'});
     jQuery(this.elementRef.nativeElement).find('.notelist').slimScroll().bind(
       'slimscroll', 
       (e, pos) => {
            if(pos === 'bottom'){
                this.loadMore();
            }
         });

  }
 
  clearObjectStore($event){
        this.ps.deleteAll();
  }
 
  
  
  loadMore(){
    this.currentPage++;
   this.ps.query(this.currentPage);
   
  }

  ngAfterViewChecked(){
     
 

  };

  openPost($event,post){
    this.ps.showPost(post);
  }

  removePost(e,post){
    
     e.stopPropagation();
     if(post && post.id){
       this.ps.removePost(post);
       
     }
     
  }

}
