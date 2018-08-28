import { Component, OnInit, Input } from '@angular/core';

import {TweetComponent} from '../tweet/tweet.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() title: any;

  constructor(public tc: TweetComponent) { }

  ngOnInit() {
    this.title = "#NowPlaying Tweets";
  }
  openStore()
  {

  }
  logout()
  {

  }
}
