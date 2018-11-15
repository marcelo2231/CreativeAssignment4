var infotext = "IT'S MOVIE NIGHT, and you haven't yet decided on a movie, instead of randomly listing off movie names that you have already watch, let us help. Press start and we will give you a list of all movies based on popularity from there, if you decide you like it, you can press the thumbs up if you want to move it's position closer to the top, the 'x' to have it removed from the list, or the movie picture to view a description and other facts. At any time, you can press the start button to start the process over again. Enjoy!"
var app = angular.module('app', ['ui.router']);
var sessionname = 0;
var sessionid=0;
var color="#FFFFFF";

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
});

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    console.log("State provider");
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: '/main.html',
        controller: 'MainCtrl'
      })
      .state('commentsTab', {
        url: '/commentsTab',
        templateUrl: '/commentsTab.html',
        controller: 'commentsTabCtrl'
      });

    $urlRouterProvider.otherwise('main');
  }
]);

app.factory("commentFactory", [function() {
  var o = {
    comments: [],
    name: 0,
    session: 0,
    allsessions:[],
    searchcomments: [],
    color:0
  };
  return o;
}]);

app.controller('MainCtrl',
  function($scope, $http, commentFactory,$window) {
    $scope.name=commentFactory.name;
    $scope.allsessions=commentFactory.allsessions;
    $scope.sessionId=commentFactory.session;
    $scope.color=commentFactory.color;
    $http.get("/distict?n=Session").then(function(response){
      $scope.allsessions=response.data;
    });
    $scope.refresh=function(){
      $http.get("/distict?n=Session").then(function(response){
        $scope.allsessions=response.data;
      });
    };
    $scope.newSession=function(){
      $scope.sessionId=$scope.newsession;
      sessionid=$scope.sessionId;
    };
    $scope.selectSession=function(thisName){
      $scope.sessionId=thisName;
    };
    $scope.begin = function() {
      if(!$scope.sessionName){
        alert("Name Required");
        return;
      }
      else if (!$scope.sessionId){
        alert("Please select a session or create a new one");
        return;
      }
      else{
        $scope.name=$scope.sessionName;
        console.log("name",$scope.name);
        sessionname=$scope.name;
        sessionid=$scope.sessionId;
        $http.get("/chat?Session="+$scope.sessionId).then(function(response) {
          console.log(response);
          $scope.comments = response["data"];
        });
        $scope.info = "";
        $window.location.href="#/commentsTab";
      }
    };
    $scope.check = function() {
      console.log("checking");
      console.log($scope.moviequeue);
    };
    $scope.deleteSession=function(thissession){
      console.log("deleting",thissession);
      $http.delete("/chat?Session="+thissession).then(function(){
        console.log("deleted",thissession);
      });
      $scope.refresh();
    };
  }
);

app.controller('commentsTabCtrl',
  function($scope, $http, commentFactory, $interval) {
    console.log("comment state");
    $scope.allcomments = commentFactory.comments;
    $scope.name = commentFactory.name;
    $scope.keyForSession = commentFactory.session;
    $scope.usercomments = commentFactory.searchcomments;
    $scope.color=commentFactory.color;
    $scope.name=sessionname;
    $scope.keyForSession=sessionid;
    $scope.color=color;
    console.log("name",$scope.name,sessionname);
    $interval(function(){
            $scope.refresh();
        },2000);

    $scope.refresh = function() {
      $http.get("/chat?Session="+$scope.keyForSession).then(function(response) {
        console.log(response);
        $scope.allcomments = response["data"];
        console.log($scope.allcomments);
        //$scope.color=response.data[
      });
    };
    $scope.getComments=function(){
      $scope.refresh();
    };
    $scope.deleteComment = function(commentinfo) {
      var url = "/chat?Name="+$scope.name+"&Message="+$scope.commentpost+"&Session="+$scope.keyForSession; 
      $http.delete(url).then(function(response) {
        console.log("deleted");
      });
      $scope.refresh();
    };
    $scope.postMessage = function() {
      var myobj = { Name: $scope.name, Session:$scope.keyForSession, Message: $scope.commentpost };
      console.log("posting",myobj);
      var url = '/chat?Name='+$scope.name+'&Message='+$scope.commentpost+'&Session='+$scope.keyForSession;
      console.log(url);

      $http.post(url).then(function() {
        console.log("posted");
      });
      $scope.commentpost="";
      $scope.refresh();
    };
    $scope.deleteAllComments = function() {
      $http.delete("/chat?Session="+$scope.keyForSession).then(function() {
        console.log("chat Deleted");
      });
      $scope.refresh();
    };
    $scope.deleteSession=function(thissession){
      $http.delete("/chat?Session="+thissession).then(function(){
        console.log("deleted",thissession);
      });
      $scope.refresh();
    };
    $scope.findComents=function(user){
      $http.get("/chat?n="+user.name+"&Session="+$scope.keyForSession).then(function(response){
        $scope.usercomments=response.data;
      });
    };
  });

app.directive('avatar', avatarDirective);

function avatarDirective() {
  return {
    scope: {
      movies: '='
    },
    restrict: 'E',
    replace: 'true',
    template: (
      '<div class ="Avatar">' +
      '<img ng-src="{{movies.nameimage}}"/>' +
      '<span id="adder" ng-click="incrementUpvotes(movie)">$ </span>' +
      '<span id="deleter" ng-click="deleteMovie(movie)"> X</span>' +
      '</div>'
    )
  }
}
