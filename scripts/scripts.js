"use strict";angular.module("parkingCheckApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngTouch","ngAnimate","ui.router","gsDirectives","ngStorage"]).constant("$config",{app:{name:"Parking Check"},"package":{name:"com.parkingcheck.gautham"},api:{prefix:"http:/",url:"api.parkwhiz.com",action:"search?q=",key:null},map:{link:"https://www.google.com/maps/dir/Current+Location/"}}).config(["$stateProvider","$urlRouterProvider","$compileProvider",function(a,b,c){b.otherwise("/dashboard"),a.state("main",{url:"/",templateUrl:"/views/main.html",controller:"MainCtrl"}).state("dashboard",{url:"/dashboard",templateUrl:"/views/dashboard.html",controller:"DashboardCtrl"}),c.aHrefSanitizationWhitelist(/^\s*(https?|geo|javascript):/)}]).run(["$rootScope","$state","$deviceListeners","NotificationService",function(a,b,c,d){a.$state=b,c.init(),a.$on("$$ready",function(){d.ready()})}]),angular.module("parkingCheckApp").controller("MainCtrl",["$scope","$geocode",function(a,b){a.locate=function(){b.geocode(a,{timeout:1e4}).then(function(b){a.position=b})},a.$on("$$ready",function(){a.isAvailable=!1,window.plugin&&window.plugin.notification&&window.plugin.notification.local&&(a.isAvailable=!0)})}]),angular.module("parkingCheckApp").factory("$geocode",["$q",function(a){return{geocode:function(b,c){var d=a.defer(),e={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};return c&&c.timeout&&(e.timeout=c.timeout),navigator&&navigator.geolocation?navigator.geolocation.getCurrentPosition(function(a){b.$apply(function(){d.resolve(a)})},function(a){switch(a.code){case 1:b.$apply(function(){d.reject("You have rejected access to your location!")});break;case 2:b.$apply(function(){d.reject("Unable to determine your location. Please try again!")});break;case 3:b.$apply(function(){d.reject("Unable to determine your location. Please make sure your GPS is enabled!")})}},e):d.reject("Browser does not support location services"),d.promise}}}]),angular.module("parkingCheckApp").factory("$deviceListeners",["$document","$rootScope",function(a,b){function c(){a[0].addEventListener("deviceReady",function(a){b.$broadcast("$$ready",{eventDefault:a})}),a[0].addEventListener("backbutton",function(a){b.$broadcast("$$back",{eventDefault:a})}),a[0].addEventListener("menubutton",function(a){b.$broadcast("$$menu",{eventDefault:a})}),a[0].addEventListener("blur",function(a){b.$broadcast("$$blur",{eventDefault:a})}),a[0].addEventListener("focus",function(a){b.$broadcast("$$focus",{eventDefault:a})}),a[0].addEventListener("pause",function(a){b.$broadcast("$$pause",{eventDefault:a})}),a[0].addEventListener("resume",function(a){b.$broadcast("$$resume",{eventDefault:a})}),a[0].addEventListener("online",function(a){b.$broadcast("$$online",{eventDefault:a})}),a[0].addEventListener("offline",function(a){b.$broadcast("$$offline",{eventDefault:a})})}return{init:c}}]),angular.module("parkingCheckApp").service("NotificationService",[function(){this.ready=function(){}}]),angular.module("parkingCheckApp").service("$parking",["$localStorage",function(a){function b(b,c){a[c]={location:b,date:new Date}}function c(){a.started=null,a.ended=null}a.parkings||(a.parkings=[]),this.isStarted=function(){return a.started},this.isEnded=function(){return a.ended},this.parked=function(d,e){"start"===e?b(d,"started"):"end"===e&&(b(d,"ended"),a.parkings.push({start:a.started,end:a.ended}),c())}}]),angular.module("parkingCheckApp").controller("DashboardCtrl",["$scope","$parking","$geocode","$config",function(a,b,c,d){function e(){c.geocode(a).then(function(b){a.current={location:b,date:new Date}}),a.isParked&&(a.isParked=null,a.isParked=a.parking)}(b.isStarted()||b.isEnded())&&(a.isParked=b.isStarted(),a.isParked&&(a.parking=a.isParked)),a.parkingControl=function(){c.geocode(a).then(a.isParked?function(c){b.parked(c,"end"),a.parking=null,a.isParked=null}:function(c){b.parked(c,"start"),a.parking=b.isStarted(),a.isParked=a.parking})},a.mapLink=d.map.link,e(),a.$on("$$focus",e),a.$on("$$resume",e)}]),angular.module("parkingCheckApp").directive("parkingButton",function(){return{templateUrl:"/views/directives/parking-button.html",restrict:"E",scope:{clicker:"="},replace:!0,required:"clicker"}}),angular.module("parkingCheckApp").filter("parkingTime",function(){return function(a){if(a){var b=moment(a);return b.fromNow()}}});