import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '../../environments/environment';

import * as Codebird from '../../assets/js/codebird.js';

import { TwitterapiService } from '../services/twitterapi/twitterapi.service';
import { EmbedVideoService } from 'ngx-embed-video';
import { Observable, empty, of } from 'rxjs';
import 'rxjs/add/observable/interval';


@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css'],
})

export class TweetComponent implements OnInit {
  /*Spiinner basic setting */
  color: string = 'primary';
  mode: string = 'indeterminate';
  value: number = 90;
  resourcesLoaded: boolean = false;
  /* twitter api setting */
  latitude: number;
  longitude: number;
  radius: string = "100mi";
  searchMetaData: any;
  searchTweets: any;
  tsinceID: number = 0;
  tmaxID: number = 0;
  refreshInterval = 450000;//45 seconds
  nextResult: string = "";
  refreshURL: string = "";
  tweetOptionFilter: string = "all";//By Default showing all tweets
  filterOption = true;
  initLoad = true;
  videoFilterCount: number = 0;
  allFilterCount: number = 0;
  videoFilterCountMessage: string = "tweet";
  allFilterCountMessage: string = "tweet";
  apiMode: string;//API Mode Call Events : next,refresh
  /* General messages setting*/
  showMessageCard: boolean = false;
  primaryMessage: any = 'Fetching your location...';
  /* Video related setting */
  iframe_html: any;
  /* Post tweet related settings */
  postTweetForm: FormGroup;
  disablePostBtn = false;
  regURL = "^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$";
  constructor(public fb: FormBuilder, private router: Router, private ts: TwitterapiService, private ds: DomSanitizer, private es: EmbedVideoService) {
    this.refreshInterval = environment.refreshInterval;
  }

  ngOnInit() {
    /* Access form control*/
    this.createForm();
    /* Ask for geo location */
    this.ts.getLocation().
      subscribe(data => {
        this.ts.showSnackBar("Location logged.", "OK");
        if (data.coords.latitude && data.coords.longitude) {
          this.latitude = data.coords.latitude;
          this.longitude = data.coords.longitude;
          this.getBearerToken(false);
        }
      }, error => {
        this.primaryMessageSetter('Location access denied. Loading tweets without location.');
        this.getBearerToken(true);
      });
  }

  /**
  * @name ngAfterViewInit
  * @description Used to refresh new tweets after a fix interval
  * @returns N/A
  */
  ngAfterViewInit() {
    Observable.interval(this.refreshInterval)
      .subscribe((val) => { this.loadTweets("refresh"); });
  }

  /**
  * @name createForm
  * @description Used to build post tweet form and it's controls
  * @returns N/A
  */
  createForm() {
    this.postTweetForm = this.fb.group({
      yturl: new FormControl('', [
        Validators.required,
        Validators.pattern(this.regURL)
      ]),
      ytcomment: new FormControl('', [
        Validators.required
      ])
    });
  }

  /**
  * @name getBearerToken
  * @description Used to get bearer/oauth token
  * @returns N/A
  */
  getBearerToken(skipGeoMode: boolean) {
    if (skipGeoMode)
        this.skipGeolocation();
      else
        this.loadTweets("next");
        /* Uncomment below lines if need to develop oAuth process */
    /*this.ts.reteriveoAuthToken().subscribe(data => {
      this.ts.setToken(data.oauth_token, data.oauth_token_secret);
      
    }, error => {

    });*/
  }

  /**
   * @name getBearerToken
   * @param apiMode
   * @description Used to load tweets
   * @returns N/A
   */
  loadTweets(apiMode: string) {
    /* Load tweets */
    this.apiMode = apiMode;
    if (!(this.latitude && this.longitude)) {
      this.latitude = 0;
      this.longitude = 0;
    }
    this.ts.getTweets(this.latitude, this.longitude, '100mi', this.tsinceID, this.tmaxID, apiMode).subscribe(data => {
      this.handleTweetsResponse(data);
    }, error => {
      this.primaryMessageSetter('Unable to connect with twitter. Please try again.');
    });
  }

  /**
   * @name skipGeolocation
   * @description Used to skip geo permission part
   * @returns N/A
   */
  skipGeolocation() {
    this.ts.getTweets(0, 0, 0, 0, 0, "next").subscribe(data => {
      this.handleTweetsResponse(data);
    }, error => {
      this.primaryMessageSetter('Problem with tweet loading. If this occur frequently then better refresh page.');
    });
  }

  /**
   * @name handleTweetsResponse
   * @param apiResponse
   * @description Used to handle and process tweet data
   * @returns N/A
   */
  handleTweetsResponse(apiResponse: any) {
    if (apiResponse.statuses && apiResponse.search_metadata) {
      this.searchMetaData = apiResponse.search_metadata;
      /* Check if data is already present :: infinite scroll case */
      if (this.searchTweets) {
        if (this.apiMode == "refresh") {
          this.searchTweets.unshift(...apiResponse.statuses);
        } else {
          apiResponse.statuses.forEach((data, index) => {
            this.searchTweets.push(data);
          });
        }
      } else {
        this.searchTweets = apiResponse.statuses;
      }
      /* Hide status cards */
      this.showMessageCard = true;
      this.resourcesLoaded = true;
      /* Fetch since ID and Max ID */
      this.allFilterCount = this.searchTweets.length;
      this.TweetIDFetcher(this.searchTweets);
      this.countVideoCount(this.searchTweets);
      this.updateCounterMessages();
    } else {
      this.primaryMessageSetter('Unable to connect with twitter. Due to heavy server load. Please refresh page.');
    }
  }

  /**
   * @name TweetIDFetcher
   * @param tweetData
   * @description Used to fetch since ID and max ID for refresh, infinte scroll respectivelly
   * @returns N/A
   */
  TweetIDFetcher(tweetData) {
    if (tweetData && tweetData.length) {
      let last: any = tweetData[tweetData.length - 1];
      /*Check for duplicate data */
      if (this.tmaxID == last.id) {
        /* Duplicate data got from api */
        //console.log("Duplicate found");
      }
      this.tmaxID = last.id;
      let first: any = tweetData[0];
      this.tsinceID = first.id;
    }
  }

  /**
   * @name checkForYTVideo
   * @param tweetData
   * @description Used to check for filter permission
   * @returns Boolean(true/false)
   */
  /*checkForFilterPermission(tweetData) {
    if (this.tweetOptionFilter == "all")
      return true;
    let videoFlag = false;
    if (tweetData && tweetData.entities && tweetData.entities.urls && tweetData.entities.urls.length > 0) {
      let urlArr = tweetData.entities.urls;
      urlArr.forEach((data, index) => {
        if (data.expanded_url.match(this.regURL))
          videoFlag = true;
      });
    }
    return videoFlag;
  }*/

  /**
  * @name countVideoCount
  * @param tweetData
  * @description Used to count youtube video count
  * @returns N/A
  */
  countVideoCount(tweetData) {
    this.videoFilterCount = 0;
    if (tweetData) {
      tweetData.forEach((dt, indx) => {
        if (dt.entities && dt.entities.urls && dt.entities.urls.length > 0) {
          let urlArr = dt.entities.urls;
          urlArr.forEach((data, index) => {
            if (data.expanded_url.match(this.regURL)){
              this.videoFilterCount++;
              this.searchTweets[indx]["is_video"] = true;
            }else{
              this.searchTweets[indx]["is_video"] = false;
            }
          });
        }else{
          this.searchTweets[indx]["is_video"] = false;
        }
      });
    }
  }

  /**
   * @name TweetDataProcessor
   * @param tweetData
   * @description Used to process tweet media urls
   * @returns iFrame HTML
   */
  TweetDataProcessor(tweetData: any) {
    let innerHtml: any = "";
    if (tweetData) {
      if (tweetData.entities && tweetData.entities.urls && tweetData.entities.urls.length > 0) {
        let urlArr = tweetData.entities.urls;
        urlArr.forEach((data, index) => {
          if (data.expanded_url.match(this.regURL)) {
            innerHtml = this.es.embed(data.expanded_url, { query: { portrait: 0, color: '333' }, attr: { width: '100%', height: 300 } })
          } else {
            innerHtml = this.ds.bypassSecurityTrustHtml('Media Link : <a target="_blank" href="' + data.expanded_url + '">' + data.expanded_url.substr(0, 50) + '...</a>');
          }
        });
      } else if (tweetData.entities && tweetData.entities.media) {
        tweetData.entities.media.forEach((dm, index) => {
          if (dm.type == "photo") {
            innerHtml = this.ds.bypassSecurityTrustHtml('<img mat-card-image style="width:100%;max-size:500px;" src="' + dm.media_url + '" alt="" />');
          }
        });
      }
    } else {
      this.iframe_html = "";
      return this.iframe_html;
    }
    return innerHtml;
  }

  /**
   * @name onSubmit
   * @description Used to handle and post tweet on user timeline
   * @returns N/A
   */
  onSubmit() {
    if (this.postTweetForm.valid) {
      this.ts.showSnackBar("Posting Tweet...", "  ");
      this.disablePostBtn = true;
      /*Concat status values */
      let status = this.postTweetForm.value.ytcomment + " " + this.postTweetForm.value.yturl + " #NowPlaying";
      /*Call Post tweet API */
      this.ts.postTweet(status, this.latitude, this.longitude).subscribe(data => {
        this.ts.showSnackBar("Tweet Posted.", "  ");
        this.resetForm(this.postTweetForm);
        this.disablePostBtn = false;
      }, error => {
        this.ts.showSnackBar("Error posting tweet. Maybe due to server load. Try after some time.", "  ");
        this.disablePostBtn = false;
      });
    } else {
      this.ts.showSnackBar("Invalid form field data.", "  ");
    }
  }

  /**
   * @name getNextSet
   * @description Used to scroll to next set || Infinite Scroll
   * @returns N/A
   */
  getNextSet() {
    this.ts.showSnackBar("Loading data...", "  ");
    this.loadTweets("next");
  }

  /*changeFilters(filterValue: string) {
    if (filterValue == this.tweetOptionFilter) {
      this.ts.showSnackBar("Select a different filter.", "OK");
    } else {
      this.tweetOptionFilter = filterValue;
    }
  }*/

  /**
   * @name replaceText
   * @param text 
   * @description Used to replace hastag and mentions in text
   * @returns Replaced text
   */
  replaceText(text: any) {
    var replacedText = text;
    var targetAttr = "";
    targetAttr = ' target="_blank"';

    // replace #hashtags
    var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
    replacedText = replacedText.replace(replacePattern1, '$1<a href="https://twitter.com/search?q=%23$2"' + targetAttr + '>#$2</a>');

    // replace @mentions
    var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
    replacedText += replacedText.replace(replacePattern2, '$1<a href="https://twitter.com/$2"' + targetAttr + '>@$2</a>');

    this.ds.bypassSecurityTrustHtml(replacedText);
    return replacedText;
  }

  /**
   * @name resetForm
   * @param formGroup
   * @description Used to reset form and their states
   * @returns N/A
   */
  resetForm(formGroup: FormGroup) {
    let control: any = null;
    formGroup.reset();
    formGroup.markAsUntouched();
    Object.keys(formGroup.controls).forEach((name) => {
      control = formGroup.controls[name];
      control.setErrors(null);
    });
  }

  /**
   * @name getBackground
   * @param image
   * @description Used to bypass security warning for background image
   * @returns Style Syntax
   */
  getBackground(image) {
    return this.ds.bypassSecurityTrustStyle(`linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${image})`);
  }

  /**
  * @name updateCounterMessages
  * @description Used to update filter wise recors counter
  * @returns Style Syntax
  */
  updateCounterMessages() {
    /* Set counter messages */
    this.allFilterCountMessage = this.allFilterCount + " " + (this.allFilterCount > 1 ? "tweets" : "tweet");
    this.videoFilterCountMessage = this.videoFilterCount + " " + (this.videoFilterCount > 1 ? "tweets" : "tweet");
  }

  shareOnBINowPlaying(tweetData) {
    let ytURL:any = "";
    if (tweetData) {
      if (tweetData.entities && tweetData.entities.urls && tweetData.entities.urls.length > 0) {
        let urlArr = tweetData.entities.urls;
        urlArr.forEach((data, index) => {
          if (data.expanded_url.match(this.regURL)) {
            ytURL = data.expanded_url;
          }
        });
      }
      /* Assign to yt url field */
      this.postTweetForm.controls['yturl'].setValue(ytURL);
    }
  }

  /**
   * @name trackByFn
   * @param index
   * @param tweet
   * @description Used to keep track of tweet data
   * @returns N/A
   */
  trackByFn(index: number, tweet) {
    return index && tweet.id && tweet.created_at;
  }

  /**
   * @name primaryMessageSetter
   * @param messages
   * @description Used to set primary message
   * @returns N/A
   */
  primaryMessageSetter(messages: string) {
    this.primaryMessage = this.ds.bypassSecurityTrustHtml(messages);
  }

}


