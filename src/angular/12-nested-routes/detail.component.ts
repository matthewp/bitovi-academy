import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pmo-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class RestaurantDetailComponent implements OnInit { //HIGHLIGHT LINE

  constructor(

  ) { }

  ngOnInit() {

  }

  getUrl(image:string): string {
    // THIS IS A DIFFERENT WAY TO HANDLE THE IMAGE PATH
    return image.replace('node_modules/place-my-order-assets', './assets')
  }
}