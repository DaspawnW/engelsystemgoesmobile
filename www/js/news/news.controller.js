angular.module('news.controller', [])
  .controller('NewsCtrl', function ($scope, $state, NewsService) {

    NewsService
      .getNews()
      .then(function (news) {
        $scope.news = news;
      });

    /**
     * open a news by his id
     * @param id
     */
    $scope.openNews = function (id) {
      $state.go('tab.newsitem', {id: id});
    };

  })
  .controller('NewsItemCtrl', function ($scope, $stateParams, NewsService) {
    NewsService
      .getNewsItem($stateParams.id)
      .then(function (item) {
        $scope.news = item;
      });
  });
