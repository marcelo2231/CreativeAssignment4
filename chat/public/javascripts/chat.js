var infotext = "IT'S MOVIE NIGHT, and you haven't yet decided on a movie, instead of randomly listing off movie names that you have already watch, let us help. Press start and we will give you a list of all movies based on popularity from there, if you decide you like it, you can press the thumbs up if you want to move it's position closer to the top, the 'x' to have it removed from the list, or the movie picture to view a description and other facts. At any time, you can press the start button to start the process over again. Enjoy!"
var app = angular.module('app', ['ui.router']);
var sessionkey = 0;

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
      .state('movie', {
        url: '/movie',
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
    searchcomments: []
  };
  return o;
}]);

app.controller('MainCtrl',
  function($scope, $http, commentFactory) {
    $scope.begin = function() {
      console.log("Main Controller");
      $http.get("/chat").then(function(response) {
        console.log(response);
        $scope.comments = response["data"];
      });
      $scope.info = "";
    };

    $scope.check = function() {
      console.log("checking");
      console.log($scope.moviequeue);
    };
  }
);

app.controller('commentsTabCtrl',
  function($scope, $http, commentFactory, $interval) {
    console.log("Movie state");
    $scope.comments = commentFactory.comments;
    $scope.name = commentFactory.name;
    $scope.keyForSession = commentFactory.session;
    $scope.searchComments = commentFactory.searchcomments;
    $scope.init = function() {
      $scope.refresh();
    };

    $scope.refresh = function() {
      $http.get("/chat").then(function(response) {
        console.log(response);
        $scope.comments = response["data"];
      });
    };
    $scope.deleteComment = function(commentinfo) {
      var myobj = { Name: $scope.name, Message: $scope.message };
      var jobj = JSON.stringify(myobj);
      var url = "/chat?" + jobj;
      $http.delete(url).then(function(response) {
        console.log("deleted");
      });
    };
    $scope.postMessage = function() {
      var myobj = { Name: $scope.name, Message: $scope.message };
      var jobj = JSON.stringify(myobj);
      var url = "/chat?" + jobj;
      console.log(url);

      $http.post(url).then(function() {
        console.log("posted");
      });
    };
    $scope.deleteComments = function() {
      $http.delete("/chat").then(function() {
        console.log("chat Deleted");
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
