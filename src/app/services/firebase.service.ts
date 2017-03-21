import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
@Injectable()
export class FirebaseService {
  listings:FirebaseListObservable<any[]>;
  listing:FirebaseObjectObservable<any[]>;
  image:FirebaseObjectObservable<any[]>;
  images:FirebaseListObservable<any[]>;
  mylistings:any;
  folder:any;
  myimages:any;
  constructor(private af:AngularFire) { 
    this.folder = 'listingimages';
    this.listings = this.af.database.list('/listings') as FirebaseListObservable<Listing[]>;
    this.images = this.af.database.list('/images') as FirebaseListObservable<Listing[]>;
    this.mylistings = this.af.database.list('/listings');
  }

  getListings(){
    return this.listings;
  }  
  getListingDetails(id){
    this.listing = this.af.database.object('/listings/'+id) as FirebaseObjectObservable<Listing>;
    return this.listing;
  }  
  getListingImages(id: any):Observable<Image[]>{
    return this.af.database.list('images')
      .map(_images => _images.filter(image => image.propid == id));
  }
  getListingsImageKey(propid: any){
  var ref = firebase.database().ref("images");
  ref.orderByChild("propid").equalTo(propid).on("child_added", function(snapshot) {
    
  });
  }
  getListingsByTitle(title: any): Observable<Listing[]> {
    return this.af.database.list('listings')
      .map(_listings => _listings.filter(listing => listing.title.toLowerCase().indexOf(title) !== -1));

  }
  deleteImage(id){
    this.image = this.af.database.object('/images/'+id) as FirebaseObjectObservable<Image>;
    return this.image.remove();
  }
  deleteListing(id){
    this.listing = this.af.database.object('/listings/'+id) as FirebaseObjectObservable<Listing>;
    return this.listing.remove();
  }
  addListing(listing){
    //create root ref
    let storageRef = firebase.storage().ref();
    let files = [(<HTMLInputElement>document.getElementById('image')).files];
    let propRef = this.listings.push(listing);
    for(var i=0;i<files[0].length;i++){
      let random = Math.floor(Math.random() * 500) + 1  ;
      let selectedFile = files[0][i];
      let path = `/${this.folder}/${random}${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot)=>{
        let image = {
          name:selectedFile.name,
          path:path,
          propid:propRef.key
        }
        return this.images.push(image);
      });
    }


  }

  editListing(key,listing){
    this.listings.update(key,listing);

    //update images
    let storageRef = firebase.storage().ref();
    let files = [(<HTMLInputElement>document.getElementById('image')).files];
    let random = Math.floor(Math.random() * 500) + 1  ;
    for(var i=0;i<files[0].length;i++){
      let selectedFile = files[0][i];
      let path = `/${this.folder}/${random}${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot)=>{
        let image = {
          name:selectedFile.name,
          path:path,
          propid:listing.id
        }
        return this.images.push(image);
      });
    }
  }
}

interface Listing{
    $key?:string;
    $title?:string;
    type?:string;
    image?:string;
    city?:string;
    owner?:string;
    bedrooms?:string;
}
interface Image{
    $key?:string;
       name?:string;
    path?:string;
}

