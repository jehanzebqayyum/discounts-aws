    angular.module('discountsApp', [])
    .controller('DiscountsController', function($scope, $http) {
      var discounts = this;

      discounts.items = [];

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'eu-west-1:38109516-e327-4f69-89b9-d70281bc0589'
    });
    AWS.config.region = 'eu-west-1';

    discounts.docClient = new AWS.DynamoDB.DocumentClient();


    discounts.search = function() {
      if(!discounts.searchTerm)
        return;

      $http({
        method: 'POST',
        url: 'http://search-discounts-b66mp2j5op2utko2iueei4rod4.eu-west-1.es.amazonaws.com/discounts/discount/_search',
        data: {query: {match: {_all: discounts.searchTerm } } },
        headers: 'application/json'
      }).then(function successCallback(response) {
        console.log(JSON.stringify(response, 2));

        discounts.items = [];          

        for (i in response.data.hits.hits) {            
          discounts.items.push(response.data.hits.hits[i]._source);            
        }
        //console.log(JSON.stringify(discounts.items));

      }, function errorCallback(response) {
        console.log(JSON.stringify(response));

        discounts.items = [];
      });

    }

    discounts.browse = function(store) {

      $http({
        method: 'POST',
        url: 'http://search-discounts-b66mp2j5op2utko2iueei4rod4.eu-west-1.es.amazonaws.com/discounts/discount/_search',
        data: {query: {match: {st: store } } },
        headers: 'application/json'
      }).then(function successCallback(response) {
        console.log(JSON.stringify(response, 2));

        discounts.items = [];          

        for (i in response.data.hits.hits) {            
          discounts.items.push(response.data.hits.hits[i]._source);            
        }
        //console.log(JSON.stringify(discounts.items));

      }, function errorCallback(response) {
        console.log(JSON.stringify(response));

        discounts.items = [];
      });
    }

    
  });


