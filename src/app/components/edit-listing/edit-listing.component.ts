import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import * as firebase from 'firebase';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.css']
})
export class EditListingComponent implements OnInit {
  id:any;
  listing:any;  
  title:any;
  owner:any;
  bedrooms:any;
  price:any;
  type:any;
  city:any;
  image:any;
  constructor(
  	private firebaseService:FirebaseService,
  	private router:Router,
  	private route:ActivatedRoute,
  	private flashMessage:FlashMessagesService
  	) { }

  ngOnInit() {
  	this.id = this.route.snapshot.params['id'];
  	this.firebaseService.getListingDetails(this.id).subscribe(listing =>{
      this.listing = listing;
      this.id = this.listing.$key;
  		this.title = this.listing.title;
  		this.owner = this.listing.owner;
  		this.bedrooms = this.listing.bedrooms;
  		this.price = this.listing.price;
  		this.type = this.listing.type;
  		this.city = this.listing.city;
  	});

  }

  onEditSubmit(){
  	let listing = {
      id:this.id,
  		title:this.title,
  		city:this.city,
  		owner:this.owner,
  		bedrooms:this.bedrooms,
  		price:this.price,
  		type:this.type
  	}
  	this.firebaseService.editListing(this.id,listing);
    this.flashMessage.show('Listing '+this.title+' was edited.' , {cssClass:'alert-success',timeout: 6000});
  	this.router.navigate(['listings']);
  }

}
