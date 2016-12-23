'use strict';

class BillingController {

  constructor($http, Auth) {
    this.$http = $http;
    this.Auth = Auth;
    this.payement_offer = Auth.getCurrentUser().payement_offer;
  }

  subscribe(){
    var subscription = {};
    subscription.user = this.Auth.getCurrentUser();
    subscription.payement_offer = this.payement_offer;
    this.$http.post('/api/users/subscribe', subscription);
  }

}

angular.module('mwApp')
  .controller('BillingController', BillingController);
