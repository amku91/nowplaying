import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable, empty, of } from 'rxjs';
import 'rxjs/add/operator/map';

import { MatSnackBar } from '@angular/material';

import { environment } from '../../../environments/environment';
import * as Codebird from '../../../assets/js/codebird.js';


@Injectable({
  providedIn: 'root'
})
/**
 * Twitter and Geo location related all methods
 */
export class TwitterapiService {
  /*Define global variables */
  cb: any;
  apiName: string = "search_tweets";
  apiPostTweetName: string = "statuses_update";
  apiBearerToekn: string = "oauth2_token";
  hashTag: string;
  resultCount: number;
  resultType: string;
  includeEntites: boolean = true;

  constructor(public snackBar: MatSnackBar) {
    /* Make code bird twitter api object */
    this.cb = new Codebird;
    /* set basic configurations to codebird twitter client */
    this.cb.setConsumerKey(environment.twitterAPI, environment.twitterAPISecret);
    if(environment.twitterToken != "" && environment.twitterTokenSecret != "")
     this.cb.setToken(environment.twitterToken, environment.twitterTokenSecret);
    /* Set API params */
    this.hashTag = environment.hashTag;
    this.resultCount = environment.resultCount;
    this.resultType = environment.resultType; 
  }

  /**
   * @name getLocation
   * @description Going to ask for location permission
   * @returns any
   */
  getLocation(): Observable<any> {
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            //this.geoLocationErrorCallback();
            observer.error(error);
          }
        );
      } else {
        this.showSnackBar("Geolocation is not supported by your browser. Showing all tweets.", "OK");
        observer.error('Unsupported Browser');
      }
    });
  }

   /**
   * @name reteriveoAuthToken
   * @description Used to retrieve oAuth token
   * @returns any
   * Use if we developing oAuth flow | Not Used
   */
  reteriveoAuthToken(): Observable<any> {
    return Observable.create(observer => {
      this.cb.__call(
        "oauth_requestToken", {
          oauth_callback: "oob"
        },
        function (reply, rate, error) {
          if (error) {
            observer.error(error);
            //console.log("error response or timeout exceeded" + error);
          }
          if (reply) {
            observer.next(reply);
            observer.complete();
          }
        });
    });
  }

   /**
   * @name setToken
   * @description Used to set codebird tokens
   * @param token oAuth token
   * @param secret oAuth secret
   * @returns any
   * Not Used | Use when we have to set up oAuth flow
   */
  setToken(token: any, secret:any) {
    //this.cb.setToken(token, secret);
    this.cb.__call(
      "oauth_authorize",
      {
          oauth_token: token
      },
      function (reply) {
        //console.log(reply);
          //cb.setToken(reply.oauth_token, reply.oauth_token_secret);

          // if you need to persist the login after page reload,
          // consider storing the token in a cookie or HTML5 local storage
      }
  );
  }

  /**
  * @name geoLocationErrorCallback
  * @description Used to show popup in case of location error || Unused Method
  * @returns void
  */
  geoLocationErrorCallback(): void {
    //this.showSnackBar("Unable to retrieve your location", "Ok");
  }

  /**
   * @name getTweets
   * @param latitude
   * @param longitude
   * @description Used to get tweets from twitter
   * @returns Observable<Tweet Json Data>
   */
  getTweets(latitude, longitude, radius, sinceID, maxID, apiMode): Observable<any> {
    let geocode = latitude + "," + longitude + "," + radius;
    /*Make api params object */
    let paramsObj = {
      q: this.hashTag,
      count: this.resultCount,
      result_type: this.resultType,
      include_entities: this.includeEntites,
      f: "videos",
      vertical: "default",
    };

    /* Some optional params setting */
    if (latitude != "0" && longitude != "0" && radius != "0")
      paramsObj['geocode'] = geocode;

    if (sinceID && sinceID != "" && sinceID != "0" && apiMode == "refresh")
      paramsObj['since_id'] = sinceID;

    if (maxID && maxID != "" && maxID != "0" && apiMode == "next")
      paramsObj['max_id'] = maxID;

    /* Initiate obseravble and api call */
    return Observable.create(observer => {
      this.cb.__call(
        this.apiName,//, geocode:"37.7749,122.4194,100mi", geocode:"37.7749,122.4194,100mi"
        paramsObj,
        function (reply, err) {
          if ((err && err.error) || !reply.httpstatus || (reply.httpstatus != 200)) {
            observer.error(err);
          }
          if (reply && reply.httpstatus == 200) {
            observer.next(reply);
            observer.complete();
          }
        }
      );
    });
  }

   /**
   * @name postTweet
   * @param status
   * @param latitude
   * @param longitude
   * @description Used to post tweets on twitter user timeline
   * @returns Observable<Tweet Json Data>
   */
  postTweet(status, latitude, longitude): Observable<any> {
    let paramsObj = {
      status: status,
      screen_name: "BInowplaying",
    };
    if (latitude != "0" && longitude != "0") {
      paramsObj['lat'] = latitude;
      paramsObj['long'] = longitude;
    }
    return Observable.create(observer => {
      this.cb.__call(
        this.apiPostTweetName,
        paramsObj,
        function (reply, err) {
          if ((err && err.error) || !reply || !reply.created_at) {
            observer.error(err);
          }
          if (reply) {
            observer.next(reply);
            observer.complete();
          }
        }
      );
    });
  }

  /**
   * 
   * @param queryString 
   * @description Unused Method.
   */
  decodeQuery(queryString: string): any {
    queryString = queryString.substr(1);
    var query = queryString.split("&");
    //console.log(query);
    var parameters = {};
    var parameter;
    for (var i = 0; i < query.length; i++) {
      parameter = query[i].split("=");
      if (parameter.length === 1) {
        parameter[1] = "";
      }
      parameters[decodeURIComponent(parameter[0])] = decodeURIComponent(parameter[1]);
    }
    return parameters;
  }

  /**
    * @name showSnackBar
    * @param message
    * @param action
    * @description Used to show notifications
    * @returns void
    */
  showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }


}
