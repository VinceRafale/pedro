angular.module('your_app_name.app.services', [])

.service('AuthService', function (){

  this.saveUser = function(user){
    window.localStorage.your_app_name_user = JSON.stringify(user);
  };

  this.getLoggedUser = function(){
    return (window.localStorage.your_app_name_user) ?
      JSON.parse(window.localStorage.your_app_name_user) : null;
  };

})


    .service('FlowService', function ($ionicPlatform, $rootScope, $state){



      var start = function(){
        $rootScope.index = 0;
        var nextCard = $rootScope.pitch.cards[$rootScope.index];
        $state.go(nextCard.template, {"index": $rootScope.index });
      };


      this.loadPitch = function(sponsorId, pitchId){
        load(sponsorId, pitchId);
      };

      var load = function(sponsorId, pitchId){

        if(isNaN(pitchId)){
          var pitchRef = new Firebase("https://nuskin.firebaseio.com/users/" + sponsorId + '/pitches/' + pitchId);
          pitchRef.on("value", function(snapshot) {

            var pitch = snapshot.val();
            if(pitch == null){
              console.debug("*** pitch is null:");
            }else{
              $rootScope.pitch = pitch;
              $rootScope.bar = pitch.bar;
              $rootScope.sponsorImg = 'img/' + pitch.sponsor.imgURL;
              $rootScope.showSponserHeader = true;
              start();
            }

          });
        }else{

          var  npitchRef = new Firebase("https://nuskin.firebaseio.com/pitches/" + pitchId);
          var userRef = new Firebase("https://nuskin.firebaseio.com/users/" + sponsorId );
          npitchRef.on("value", function(snapshot) {

            var pitch = snapshot.val();
            $rootScope.pitch = pitch;
            userRef.on("value", function(userSnapshot) {
              $rootScope.pitch.sponsor = userSnapshot.val();
              $rootScope.bar = $rootScope.pitch.bar;
              $rootScope.sponsorImg = 'img/' + pitch.sponsor.imgURL;
              $rootScope.showSponserHeader = true;
              start();
            });
          });
        }

      };



      this.init = function(){
        var pitchId = window.localStorage['pitchId'] || null;
        var sponsorId = window.localStorage['sponsorId'] || null;
        var returnVisit = window.localStorage['return'] || null;

        var pitchRef = {};

        if(returnVisit == true){
          $rootScope.message = "Return Visitor";
          $state.go('login');
        }else if(pitchId && sponsorId) {
          pitchRef = new Firebase("https://nuskin.firebaseio.com/users/" + sponsorId + '/pitches/' + pitchId);

          $rootScope.message = 'found incomplete SignUp';
          load(sponsorId, pitchId);
        }else if(window.Branch) {
          var branch = window.Branch;
          branch.init("key_test_flpGUS7FifTtYfqYqyPvhackDqbU0UbQ", function (err, data) {
            $rootScope.message = "Retrieved Branch Data";
            if (!err) {
              var prettyData = JSON.parse(data.data);

              if (prettyData["+clicked_branch_link"]) {
                $rootScope.message = "App install with passed in PitchID";


                $rootScope.refPitchId = prettyData["+pitch_id"];
                $rootScope.refSponsorId = prettyData["+sponsor_id"];



                window.localStorage.pitchId = $rootScope.refPitchId;
                window.localStorage.sponsorId = $rootScope.refSponsorId;
                load($rootScope.refSponsorId, $rootScope.refPitchId);

              } else {

                findPitchByGeo();
              }

            } else {
              $rootScope.message = "error" + err;
            }
          })

        }else{
          findPitchByGeo();
        }

        window.localStorage.initilized = true;
      };



      var findPitchByGeo = function(){
        $rootScope.message = "Looking for Broadcasted Pitch";
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var lat = Math.round(position.coords.latitude * 10);
            var long = Math.round(position.coords.longitude * 10);
            var geoLoc = "loc" + lat + "x" + long;
            var pitchRef = new Firebase("https://nuskin.firebaseio.com/locations/" + encodeURI(geoLoc));
            pitchRef.on("value", function (snapshot) {

              var pitch = snapshot.val();
              if (pitch == null) {
                console.debug("*** pitch is null:");
              } else {
                $rootScope.pitch = pitch;
                $rootScope.bar = pitch.bar;
                $rootScope.sponsorImg = 'img/' + pitch.sponsor.imgURL;
                $rootScope.showSponserHeader = true;
                start();
              }
            })
          });
        }else{
          $rootScope.message = "No Reference, No One Broadcasting, need to ask for Sponsor ID";
        }


      }










      this.startPitch = function(){
        start();
      };

      this.loadPitchByGeo = function(){
        findPitchByGeo();
      }

      this.forward = function(){
        $rootScope.index = parseInt($rootScope.index) + 1;

        if($rootScope.index >= $rootScope.pitch.cards.length){
          $state.go('office');
        }else{
          var nextCard = $rootScope.pitch.cards[$rootScope.index];
          $state.go(nextCard.template, {"index": $rootScope.index });
        }

      };

      this.back = function(){

        if(parseInt($rootScope.index) == 0){
          return;
        }else{
          $rootScope.index = parseInt($rootScope.index) - 1;
          var nextCard = $rootScope.pitch.cards[$rootScope.index];
          $state.go(nextCard.template, {"index": $rootScope.index });
        }
      };
    })



    .service('UserService', function (){

      this.createUser = function(email, callback){
        var ref = new Firebase("https://nuskin.firebaseio.com");
        ref.createUser({
          email: email,
          password: "abc123"
        }, function(error, userData) {
          if (error) {
            switch (error.code) {
              case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                break;
              case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
                break;
              default:
                console.log("Error creating user:", error);
            }
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
          }
        });
      };

      this.authUser = function(username, password, callback){
        var ref = new Firebase("https://nuskin.firebaseio.com");
        ref.authWithPassword({
          "email": username,
          "password": password
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            callback(authData);
            //console.log("Authenticated successfully with payload:", authData);
          }
        });
      };
    })


  .service('CardService', function ($firebaseObject){

   var pitch = {};

    pitch.cards = [ {"bgImage":"temp.png"}, {"bgImage":"two.png"}, {"bgImage":"three.png"}, {"bgImage":"four.png"}];
    pitch.bar = "bar-royal";
      pitch.sponsor = {};
      pitch.sponsor.imgURL = "";
      pitch.sponsor.name = "";
      pitch.sponsor.title  = "";
      pitch.sponsor.description  = "";


    this.set = function(pitch){
     this.pitch = pitch;
    }

    this.simple = function(cardNumber){
      return pitch.cards[cardNumber - 1];
    };

    this.length = function(){
      return pitch.cards.length;
    }

  })

.service('PostService', function ($http, $q){

  this.getUserDetails = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //find the user
      var user = _.find(database.users, function(user){ return user._id == userId; });
      dfd.resolve(user);
    });

    return dfd.promise;
  };

  this.getUserPosts = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      //get user posts
      var userPosts =  _.filter(database.posts, function(post){ return post.userId == userId; });
      //sort posts by published date
      var sorted_posts = _.sortBy(userPosts, function(post){ return new Date(post.date); });

      //find the user
      var user = _.find(database.users, function(user){ return user._id == userId; });

      //add user data to posts
      var posts = _.each(sorted_posts.reverse(), function(post){
        post.user = user;
        return post;
      });

      dfd.resolve(posts);
    });

    return dfd.promise;
  };

  this.getUserLikes = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //get user likes
      //we will get all the posts
      var slicedLikes = database.posts.slice(0, 4);
      // var sortedLikes =  _.sortBy(database.posts, function(post){ return new Date(post.date); });
      var sortedLikes =  _.sortBy(slicedLikes, function(post){ return new Date(post.date); });

      //add user data to posts
      var likes = _.each(sortedLikes.reverse(), function(post){
        post.user = _.find(database.users, function(user){ return user._id == post.userId; });
        return post;
      });

      dfd.resolve(likes);

    });

    return dfd.promise;

  };

  this.getFeed = function(page){

    var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page-1),
        totalPosts = 1,
        totalPages = 1,
        dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      totalPosts = database.posts.length;
      totalPages = totalPosts/pageSize;

      var sortedPosts =  _.sortBy(database.posts, function(post){ return new Date(post.date); }),
          postsToShow = sortedPosts.slice(skip, skip + pageSize);

      //add user data to posts
      var posts = _.each(postsToShow.reverse(), function(post){
        post.user = _.find(database.users, function(user){ return user._id == post.userId; });
        return post;
      });

      dfd.resolve({
        posts: posts,
        totalPages: totalPages
      });
    });

    return dfd.promise;
  };
})

.service('ShopService', function ($http, $q, _){

  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('database.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('database.json').success(function(database) {
      var product = _.find(database.products, function(product){ return product._id == productId; });

      dfd.resolve(product);
    });
    return dfd.promise;
  };

  this.addProductToCart = function(productToAdd){
    var cart_products = !_.isUndefined(window.localStorage.ionTheme1_cart) ? JSON.parse(window.localStorage.ionTheme1_cart) : [];

    //check if this product is already saved
    var existing_product = _.find(cart_products, function(product){ return product._id == productToAdd._id; });

    if(!existing_product){
      cart_products.push(productToAdd);
    }

    window.localStorage.ionTheme1_cart = JSON.stringify(cart_products);
  };

  this.getCartProducts = function(){
    return JSON.parse(window.localStorage.ionTheme1_cart || '[]');
  };

  this.removeProductFromCart = function(productToRemove){
    var cart_products = JSON.parse(window.localStorage.ionTheme1_cart);

    var new_cart_products = _.reject(cart_products, function(product){ return product._id == productToRemove._id; });

    window.localStorage.ionTheme1_cart = JSON.stringify(new_cart_products);
  };

})




;
