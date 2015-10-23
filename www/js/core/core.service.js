angular.module('core.service', [])
  .value('configuration', {
    http: 'http://localhost:8888'
  })

  .factory('LoginService', function ($q, $http, $ionicModal, $rootScope, configuration) {
    var LOCALSTORAGE_KEY = 'api_key';


    /**
     * Service to check if user is authenticated
     * @returns {boolean} is authenticated
     */
    var isAuthenticated = function () {
      return !(localStorage.getItem(LOCALSTORAGE_KEY) === '' || localStorage.getItem(LOCALSTORAGE_KEY) === undefined || localStorage.getItem(LOCALSTORAGE_KEY) === null);
    };

    /**
     * show login modal to sign in user and get api_key
     */
    var showDialog = function () {
      var self = this;
      var $scope = $rootScope.$new();// scope for dialog

      $scope.user = {};
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

      $scope.submit_form = function (form) {
        if (form.$valid) {
          self.authenticate($scope.user.nick, $scope.user.password)
            .then(function () {
              $scope.modal.hide();
            }, function () {

            });
        }
      };
    };

    /**
     * Sends request to authenticate user
     */
    var authenticate = function (username, password) {
      var deferrer = $q.defer();
      var basicHeader = 'Basic ' + btoa(username + ':' + password);

      $http.get(configuration.http + '/?p=api_key', {
        headers: {
          Authorization: basicHeader
        }
      })
        .success(function (response) {
          localStorage.setItem(LOCALSTORAGE_KEY, response.api_token);
          setHeader();
          deferrer.resolve();
        });

      return deferrer.promise;
    };

    /**
     * return the stored api key
     */
    var getApiKey = function () {
      if (isAuthenticated()) {
        return $q.when(localStorage.getItem(LOCALSTORAGE_KEY));
      }
      return showDialog();
    };

    /**
     * This service set the x api header
     */
    var setHeader = function () {
      if (isAuthenticated()) {
        $http.defaults.headers.common['X-API-KEY'] = localStorage.getItem(LOCALSTORAGE_KEY);
      }
    };


    return {
      isAuthenticated: isAuthenticated,
      showDialog: showDialog,
      authenticate: authenticate,
      getApiKey: getApiKey,
      setHeader: setHeader
    }
  })
/**
 * this interceptor handles every error response from server
 */
  .factory('HandlerInterceptor', function ($injector) {
    return {
      responseError: function (rejection) {
        if (rejection.status === 401) {
          $injector.get('LoginService').showDialog();
        }
        else if (rejection.status !== 403) {
          // TODO: handle other errors
        }
      }
    }
  });
