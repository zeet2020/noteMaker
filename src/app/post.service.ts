import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http'
import { EventEmitter, Output } from '@angular/core';
import {AngularIndexedDB} from 'angular2-indexeddb';
const STORENAME = "note";
const db = new AngularIndexedDB("noteMaker", 1);
declare var _;


@Injectable()
export class PostService {
   
   listPost = [];
   db;
   ready;
   @Output() openPost:EventEmitter<any> = new EventEmitter();
   @Output() postRemoved:EventEmitter<any> = new EventEmitter();
   
  constructor(private http:Http) {
             
            this.db = db;
           
            this.ready = this.db.createStore(1, (evt) => {
              
                        let objectStore = evt.currentTarget.result.createObjectStore(
                           STORENAME,
                           { keyPath: "id"});
                           objectStore.createIndex("created", "created", { unique: false });
                           //var cursor = evt.target.result;
                           //cursor.advance(5);


            });   
            
  }

   
  onDbReady(callback){
     return this.ready.then(callback);
  }


  deleteAll(){
    this.db.clear(STORENAME).then(() =>{
        this.listPost.splice(0,this.listPost.length);
        this.postRemoved.emit({content:''});
    },() => {
      console.log("failed");
    });
  }



  query(page){
      
      var page = page || 0
      var advance = (page === 0)?false:true;
      var perpage = 15;
      var counter = 0; 
      this.db.openCursor(STORENAME,(e) => {
                 let cursor = e.target.result;
                 if(!cursor){
                   return;
                 }
                 
                 if(advance){
                   advance = false;
                   cursor.advance(perpage*page);
                   return 
                 }
                 counter++;
                 this.listPost.push(cursor.value);
                 if(counter < perpage){
                     cursor.continue();
                 }                
                 
      },'created');
      return this.listPost;
  }


  getPost(){
    return this.query(0);
  }


  _getPost(){
    //return this.http.get("src/data/posts.json");
    this.listPost.splice(0,this.listPost.length);
    this.db.getAll(STORENAME).then((note) => {
              if(!(note instanceof Array)){
                     note = [note];
              }          
                  
              for(let i of note){
                this.listPost.push(i)
              }    
              
      
              }, (error) => {
                   
                    console.log(error);
    });
        
    return this.listPost;

  }
  
  removePost(post){
    
    this.db.delete(STORENAME, post.id).then((deleted)=>{
      let index = _.findLastIndex(this.listPost,{id:post.id});
      this.listPost.splice(index,1);
      this.postRemoved.emit({content:''});
    });
  }



  updatePost(obj:any){
    obj.title = this.prepareTitle(obj.content);
    this.db.update(STORENAME,obj).then(() => {
    let index = _.findLastIndex(this.listPost,{id:obj.id});
      this.listPost[index].title = this.prepareTitle(obj.content)
        

      }, (error) => {
            console.log(error);
   });
  }


  prepareTitle(str:string){
    var tmpel = document.createElement('div');
        tmpel.innerHTML = str;
    if(tmpel.textContent.length > 45){
         str = tmpel.textContent.slice(0,44);
    }else{
         str = tmpel.textContent;
    }
   return str;
  }

  uuid_gen(){

   return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
           return v.toString(16);
     }));  



  }

  showPost(obj:any){
    this.db.getByKey(STORENAME,obj.id).then((post) => {
     this.openPost.emit(post);
    },(error) => {})
  }

  addPost(obj:any){
    if(obj && obj.id){
      return this.updatePost(obj);
    }
    
    var len = this.listPost.length;
    //obj.id = len++; 
    obj.title = this.prepareTitle(obj.content); 
    obj.id = this.uuid_gen()
    obj.created = (new Date()).getTime();
    //this.listPost.push(obj);
     this.db.add(STORENAME, obj).then((item) => {
          delete item.value.content;
          this.listPost.unshift(item.value);
}, (error) => {
    console.log(error);
});



  }
  
}
