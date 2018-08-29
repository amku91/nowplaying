# Tweeter NowPlaying

Want to fetch some hashtag tweets from twitter? Or want to post youtube videos on your timeline? Yes! This is what is made for. Currently fetching #nowplaying hashtag from Twitter and displaying like twitter as you see on twitter. Also, post youtube videos by youtube video URL on your timeline behalf of you. #twitter #nowpalying #posttweet


# Why this tech stack ?
Throughout any development cycle, there are thousands of decisions that need to be made related to technology and product features. So by searching on the internet, I found a lot of twitter official client library available based on javascript with great scalability and capability. It's a win-win situation for this project because we don't need a database to store anything so frontend library is enough for us. No doubt angular is perform amazingly with angular material designs so it is.

The second reason for choosing angular is we need a framework on the frontend to build this. So angular 6 it is.


# Tech Stacks

Built by using :

1. Angular 6    -->> `https://angular.io/`
2. Codebird twitter client plugin    -->> `https://github.com/jublonet/codebird-js`
3. ngx-infinte-scroll    -->> `https://www.npmjs.com/package/ngx-infinite-scroller`
4. ngx-embed-video    -->> `https://www.npmjs.com/package/ngx-embed-video`
5. Angular Material Design    -->> `https://material.angular.io/`
6. Angular Material Icons    -->> `https://material.io/tools/icons/?style=baseline`
7. Twitter Resources    -->> `https://about.twitter.com/en_us/company/brand-resources.html`

# Features

1. Auto infinite scroll
2. Auto Refresh Tweets
3. Manually load next bunch of tweets
4. Add directly video to tweet content
5. View Hashtag, mentions and tweet info on twitter by just clicking
6. Tweet view filter option(All / Video only)
7. Smooth UI Experience
8. Post tweet to the timeline

and a lot. :)

# Error Responses

While using this application you might experience some API load error. This happened due to twitter. In case of massive API request or server load twitter sometimes return HTTP status 500[Internal Server Error]. So no worries about same this system automatically gonna handle them.


# Twitter API Endpoints

1. Standard Search API

    Resources URL : `https://api.twitter.com/1.1/search/tweets.json`
    Documentation : `https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets.html`

2. POST statuses/update API

    Resources URL : `https://api.twitter.com/1.1/statuses/update.json`
    Documentation : `https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update.html`


# Generated Through

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
