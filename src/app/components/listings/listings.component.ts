import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  listings:any;
  search:any;
  count:any;
  constructor(private firebaseService:FirebaseService) {
    
    this.firebaseService.getListings().subscribe(listings => {
      this.listings = listings;
      this.count = listings.length;
    });  
  }

  ngOnInit() {   
  }
  searchProps(){    
    this.firebaseService.getListingsByTitle(this.search.toLowerCase()).subscribe(listings => { 
      this.listings = listings;
    });
  }

}
