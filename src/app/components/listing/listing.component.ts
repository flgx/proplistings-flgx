import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {Router, ActivatedRoute, Params} from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  id:any;
  listing: any;
  imageUrls: ImageUrl[] = [];
  images:any;
  image;
  count:any;
  path:any;
  deleted:any;
  constructor(
    private firebaseService: FirebaseService,
    private router:Router,
    public af:AngularFire,
    private route:ActivatedRoute,    
    private flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {
    // Get ID
    this.id = this.route.snapshot.params['id'];
    this.firebaseService.getListingDetails(this.id).subscribe(listing => {
      this.listing = listing;
    });
    this.imageUrls = []; 
    this.firebaseService.getListingImages(this.id).subscribe(images => { 
      this.images = images;
      for(var i = 0; i<images.length;i++){
      let image = images[i];
      let storageRef = firebase.storage().ref();
      let spaceRef = storageRef.child(image.path);
      storageRef.child(image.path).getDownloadURL().then((url) => {
        // Set image url
        this.imageUrls.push(new ImageUrl(image.$key,url));
        
      }).catch((error) => {
        console.log(error);
      });        
      }
    });
  }

  onDeleteProp(){ 
    this.firebaseService.getListingImages(this.id).subscribe(images => { 
      this.images = images;
      for(var i = 0; i<images.length;i++){
      let image = images[i];
      let storageRef = firebase.storage().ref();
      let spaceRef = storageRef.child(image.path);// Delete the file      
      this.firebaseService.deleteImage(image.$key);
      spaceRef.delete().then(function() {
      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });      
      }
    });
    this.firebaseService.deleteListing(this.id);
    this.flashMessage.show('Property deleted!' , {cssClass:'alert-danger',timeout: 6000});
    this.router.navigate(['listings']);
  }

  onDeleteImage(propid,id){
    this.firebaseService.deleteImage(id);
    this.flashMessage.show('Image deleted!' , {cssClass:'alert-danger',timeout: 6000});
    this.imageUrls = [];

  }

}
export class ImageUrl {
  url: string;
  id:string;
  constructor(_id:string,_url: string) {
     this.url = _url
     this.id = _id;
  }
}