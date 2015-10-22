angular.module('news.service', [])
  .factory('NewsService', function ($http, $q, configuration) {

    var getNews = function () {
      var defer = $q.defer();

      $http.get(configuration.http + '/?p=api&r=news')
        .success(function (body) {
          defer.resolve(body);
        });

      return defer.promise;
    };

    var getNewsItem = function (id) {
      var defer = $q.defer();

      $http.get(configuration.http + '/?p=api&r=news&id=' + id)
        .success(function (body) {
          defer.resolve(body);
        });

      return defer.promise;
    };

    return {
      getNews: getNews,
      getNewsItem: getNewsItem
    }
  });
