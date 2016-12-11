import { Component, ElementRef, OnInit } from '@angular/core';
import { PostService } from '../post.service.ts';

declare var jQuery:any;
declare var MediumEditor:any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  content:any;
  editor:any;
  

  constructor(private ps:PostService,private elementRef:ElementRef) { 
    this.content = {};
  }

  ngOnInit() {
    this.ps.openPost.subscribe((data) => {
      this.showPost(data); 
      
    });

    this.ps.postRemoved.subscribe(()=>{
       this.showPost({content:''});
    });

    jQuery(this.elementRef.nativeElement).find('#editable').slimScroll({height: '575px'});
    
  }

  ngAfterViewInit(){
     
      this.editor = new MediumEditor('#editable');
  }

  saveNote(){
      
      

    if(this.content["content"] === this.editor.getContent()) return false;

   
     this.content["content"] = this.editor.getContent();
     //this.content["id"] = this.ps.getPost().length+1;
     if(this.content && this.content.content && this.content.content.length > 0){
       
       this.ps.addPost(this.content);

     }
     
     
     
  }

  newNote(){
    this.content = {};
    this.editor.setContent('');
  }


  showPost(data){
    this.content = null;
    this.content = data;
    this.editor.setContent(this.content.content);
  }

}
