var YoutubeKids = angular.module("YoutubeKids", ["firebase", "ngRoute", "ngSanitize"]);
YoutubeKids.constant("youtubeKidsRef", new Firebase("https://youtube-kids-mjggssrwh7vvs.firebaseio.com/"));
YoutubeKids.factory("FirebaseRef", ["$firebaseObject", "$firebaseArray", "youtubeKidsRef", function ($firebaseObject, $firebaseArray, youtubeKidsRef) {
    var f = youtubeKidsRef;
    return {
        $firebase: function () {
            return f;
        },
        $getArray: function (location) {
            return $firebaseArray(location);
        },
        $getObject: function (location) {
            return $firebaseObject(location);
        }
    }
}])
YoutubeKids.controller("VideoGroups", ["FirebaseRef", "$scope", function (FirebaseRef, $scope) {
    //console.log(FirebaseRef);
    var videoGroups = FirebaseRef.$getArray(FirebaseRef.$firebase().child("groups/"));
    videoGroups.$loaded().then(function () {
        $scope.videoGroups = videoGroups;
        $scope.videoGroups.$watch(function (event) {
            location.reload();
        });
    })
}]);
YoutubeKids.controller("VideoGroupView", ["FirebaseRef", "$routeParams", "$scope", "$http", function (FirebaseRef, $routeParams, $scope, $http) {
    $scope.videoGroupName = $routeParams.videogroup;
    var videosFromVideoGroup = FirebaseRef.$getArray(FirebaseRef.$firebase().child("groups/" + $routeParams.videogroup + "/videos/"));
    $scope.titleInfo = [];
    $scope.thumbInfo = [];
    videosFromVideoGroup.$loaded().then(function () {
        //console.log(videosFromVideoGroup.length);
        var getInfo = function (n) {
            $http.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videosFromVideoGroup[i]["video-url"] + "&key=AIzaSyCSyZC0HQdnPSQaA-Yr9Ocsjv30_WLgudQ").success(function (d) {
                //console.log(d.items[0].snippet.title);
                //console.log(d);
                $scope.thumbInfo[n] = d.items[0].snippet.thumbnails.high.url;
                $scope.titleInfo[n] = d.items[0].snippet.title;
            })
        }
        for (var i = 0; i < videosFromVideoGroup.length; i++) {
            getInfo(i);
        }
        $scope.videos = videosFromVideoGroup;
        $scope.videos.$watch(function (event) {
            location.reload();
        });
    });
}]);
YoutubeKids.controller("WatchVideo", ["$scope", "$routeParams", "$sce", function ($scope, $routeParams, $sce) {
    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    }
    $scope.video = 'https://www.youtube-nocookie.com/embed/' + $routeParams.vid + '?rel=0';
    $("iframe").height($(window).height() - 195);
}]);
YoutubeKids.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "video-groups.html",
        controller: "VideoGroups"
    }).when("/:videogroup/", {
        templateUrl: "video-group-view.html",
        controller: "VideoGroupView"
    }).when("/watch/:vid", {
        templateUrl: "watch.html",
        controller: "WatchVideo"
    }).otherwise({
        redirectTo: "/"
    });
});
$(window).resize(function () {
    $("iframe").height($(window).height() - 195);
})
