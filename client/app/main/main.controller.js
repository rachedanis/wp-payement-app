'use strict';

(function() {

  class MainController {

    constructor($http, $scope, socket, Auth) {
      this.$http = $http;
      this.socket = socket;
      this.freePosts = [];
      this.premiumPosts = [];
      this.isLoggedIn = Auth.isLoggedIn;
      this.isAdmin = Auth.isAdmin;
      this.getCurrentUser = Auth.getCurrentUser;

      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('post');
      });
    }

    $onInit() {
      this.$http.get('/api/posts/free')
        .then(response => {
          this.freePosts = response.data;
          this.socket.syncUpdates('post', this.freePosts);
        });
      this.$http.get('/api/posts/premium')
          .then(response => {
            this.premiumPosts = response.data;
            this.socket.syncUpdates('post', this.premiumPosts);
          });
    }
/*{
  name: this.newPost.id
});*/
    addPost() {
      if (this.newPost) {
        this.$http.post('/api/posts', this.newPost);
        this.newPost = '';
      }
    }

    deletePost(post) {
      this.$http.delete('/api/posts/' + post._id);
    }
  }

  angular.module('mwApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
