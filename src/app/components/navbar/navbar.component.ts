import { Component, OnInit } from '@angular/core';
import {DataExchangeService} from "../../services/data-exchange.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  today: Date;

  postsCount: number;

  constructor(
    private dataExchangeService: DataExchangeService
  ) { }

  ngOnInit() {
    this.today = new Date();
    this.dataExchangeService.currentPostsCount.subscribe( count => {
      this.postsCount = count;
    });
  }

}
