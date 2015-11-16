angular.module('your_app_name.auth.controllers', [])


.controller('WelcomeCtrl', function($scope, $state, $ionicModal){
	// $scope.bgs = ["http://lorempixel.com/640/1136"];
	$scope.bgs = ["img/welcome-bg.jpeg"];

	$scope.facebookSignIn = function(){
		console.log("doing facebbok sign in");
		$state.go('app.feed');
	};

	$ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

	$ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

	$scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };
})

.controller('CreateAccountCtrl', function($scope, $state, $firebaseAuth,  $rootScope){



    $scope.signupData = {};
    $scope.signupData.name = "";
    $scope.signupData.email = "";

    var ref = new Firebase("https://nuskin.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);


	$scope.doSignUp = function(){
        $scope.authObj.$createUser({
            email: $scope.signupData.email,
            password: "abc123"
        }).then(function(userData) {
            console.log("User " + userData.uid + " created successfully!");

            ref.child('users').child(userData.uid).set({
                name: $scope.signupData.name,
                email: $scope.signupData.email,
                title: "ruby",
                imgURL: "dean.png",
                description: "This is a story about me"
            }, function (userdata) {
                console.log("User Account Created:", userdata);

                var user = {};
                user.title = "ruby";
                user.imgURL = "dean.png";
                user.description = "This is a story about me";
                user.name = $scope.signupData.name;
                user.email = $scope.signupData.email;

                $rootScope.user = user;
            });

            return $scope.authObj.$authWithPassword({
                email: $scope.signupData.email,
                password: "abc123"
            });
        }).then(function(authData) {
            console.log("Logged in as:", authData.uid);
            $state.go('simpleCheckOut');
        }).catch(function(error) {
            console.error("Error: ", error);
        });


	};
})

.controller('LoginCtrl', function($scope, $state, $ionicModal, $rootScope, $firebaseAuth){

        var ref = new Firebase("https://nuskin.firebaseio.com");


        var authData = ref.getAuth();
        if (authData) {
           $state.go('office');
        } else {
            console.log("Logged out");
        }




    $scope.error = "";

    $scope.user = {};

    $scope.user.username = "";
    $scope.user.password = "";

	$scope.doLogIn = function(){


        $scope.authObj = $firebaseAuth(ref);


        $scope.authObj.$authWithPassword({
            email: $scope.user.username,
            password: $scope.user.password
        }).then(function(authData) {
            ref.child("/users/" + authData.uid).on("value", function(snapshot) {
                $rootScope.user = snapshot.val();
                $rootScope.user.uid = authData.uid;
                console.log("Authentication Success:", $rootScope.user);
            });
            $state.go('office');
        }).catch(function(error) {
            console.error("Authentication failed:", error);
            $scope.error = error.message;
        });

	};

	$ionicModal.fromTemplateUrl('views/auth/forgot-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.forgot_password_modal = modal;
  });

  $scope.showForgotPassword = function() {
    $scope.forgot_password_modal.show();
  };

	$scope.requestNewPassword = function() {
    console.log("requesting new password");
  };

  // //Cleanup the modal when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // // Execute action on hide modal
  // $scope.$on('modal.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove modal
  // $scope.$on('modal.removed', function() {
  //   // Execute action
  // });
})


  .controller('CardCtrl', function($scope, $state, $stateParams, CardService, $rootScope){


      $rootScope.showSponserHeader = true;

      $scope.index = $stateParams.index;

        if($rootScope.pitch == undefined){
            $state.go('loading');
        }

       var cards = $rootScope.pitch.cards;




      $scope.background = "img/cards/" + cards[$stateParams.index - 1].bgImage;



      $scope.onSwipeLeft = function(){
        if(cards.length > $stateParams.index){
          $state.go('card', {'index': parseInt($stateParams.index)  + 1});
        }else{
          $state.go('product');
        }

      }


      $scope.onSwipeRight = function(){
        if($stateParams.index > 1){
          $state.go('card', {'index': parseInt($stateParams.index) - 1});
        }else{
          //alert("out of cards");
        }
      }

  })
    .controller('ProductCardCtrl', function($scope, $stateParams, ShopService, $state,$ionicPopup, $ionicLoading) {
        var productId = $stateParams.productId;

        ShopService.getProduct(productId).then(function(product){
            $scope.product = product;
            ShopService.addProductToCart(product);
        });



        $scope.onSwipeLeft = function(){
            $state.go('shipping');
        }


        $scope.onSwipeRight = function(){
            $state.go('card', {'index': 1});
        }

        // show add to cart popup on button click
        $scope.showAddToCartPopup = function(product) {
            $scope.data = {};
            $scope.data.product = product;
            $scope.data.productOption = 1;
            $scope.data.productQuantity = 1;

            var myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'views/app/shop/partials/add-to-cart-popup.html',
                title: 'Add to Cart',
                scope: $scope,
                buttons: [
                    { text: '', type: 'close-popup ion-ios-close-outline' },
                    {
                        text: 'Add to cart',
                        onTap: function(e) {
                            return $scope.data;
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                if(res)
                {
                    $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
                    ShopService.addProductToCart(res.product);
                    console.log('Item added to cart!', res);
                }
                else {
                    console.log('Popup closed');
                }
            });
        };
    })
    .controller('HeaderCtrl', function($scope, $stateParams, PostService, $ionicHistory, $state, $ionicScrollDelegate, $ionicModal, $rootScope) {


        $scope.barclass= "bar-balanced";//$rootScope.pitch.bar;//"bar-balanced";

        $scope.$on('$ionicView.afterEnter', function() {
            $ionicScrollDelegate.$getByHandle('profile-scroll').resize();
        });


        $scope.goToSponsor = function(){
            $state.go("bingo");
        }


        $scope.showSponsor = function() {
            $scope.sponsor.show();
        };

        $scope.goToLogin = function(){
            $state.go('login');
        }


    })


    .controller('SponsorCtrl', function($scope, $stateParams, PostService, $ionicHistory, $state, $ionicScrollDelegate, $ionicModal, $rootScope) {

        $scope.back = function (){

            window.history.back();
        }


    })
    .controller('BingoCtrl', function($scope, $stateParams, PostService, $ionicHistory, $state, $ionicScrollDelegate, $ionicModal, $rootScope) {

        $rootScope.showSponserHeader = false;

        $scope.back = function (){

            window.history.back();
        }

    })
    .controller('PitchesCtrl', function($scope, ShopService, $ionicModal, $state, $rootScope){


        var name = "Sally Smith";


        if($rootScope.user){
            name = $rootScope.user.name;
        }else{
            console.log("No User");
        }
        //$scope.products = ShopService.getCartProducts();

        var pitches = [
            {
                "name": "peppermint",
                "id": 1,
                "cards": [
                    {
                        "bgImage": "temp.png"
                    },
                    {
                        "bgImage": "two.png"
                    },
                    {
                        "bgImage": "three.png"
                    },
                    {
                        "bgImage": "four.png"
                    }
                ],
                "bar": "bar-balanced",
                "sponsor": {
                    "imgURL": "sally.jpg",
                    "name": name,
                    "title": "Ruby",
                    "description": "Thisisthedescription"
                }
            },
            {

                "name": "lavender",
                "id": 2,
                "cards": [
                    {
                        "bgImage": "temp.png"
                    },
                    {
                        "bgImage": "two.png"
                    },
                    {
                        "bgImage": "2-three.png"
                    },
                    {
                        "bgImage": "2-four.png"
                    }
                ],
                "bar": "bar-royal",
                "sponsor": {
                    "imgURL": "dean.png",
                    "name": name,
                    "title": "Blue Diamond",
                    "description": "Thisisthedescription"
                }
            }
        ];
        $scope.pitches = pitches;




        $ionicModal.fromTemplateUrl('views/auth/cards/modals/pitch.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.pitchDialog = modal;
        });



        $scope.selectPitch = function(pitch){
            $scope.pitch = pitch;
            $scope.pitchDialog.show();

        }


        $scope.share = function(pitch){




            window.plugins.socialsharing.share('Rediscover natural ways to live better',
                pitch.name,
                'img/epoch.jpeg',
                'http://pedro-nuskin.s3-website-us-west-2.amazonaws.com/#/p/' + pitch.id + '/' + $rootScope.user.uid);
        }


         $scope.broadcast = function(pitch){

             var geoLoc = "";
             navigator.geolocation.getCurrentPosition(function(position) {
                 var lat = Math.round(position.coords.latitude * 10);
                 var long = Math.round(position.coords.longitude * 10);
                 geoLoc = "loc" + lat + "x" + long;
                 console.log("location", geoLoc);
                 var locationRef = new Firebase("https://nuskin.firebaseio.com/locations/" + geoLoc);
                 delete pitch.$$hashKey;
                 console.log("location", pitch);
                 locationRef.set(pitch, success());


             });

         } ;

        var success = function(data){
            console.log("updated!", data);
            $scope.pitchDialog.hide();
            $state.go('loading');
        }


    })

.controller('PitchCtrl', function($scope,$stateParams, $rootScope, $state ){

        var userId = $stateParams.userId;
        var pitchId = $stateParams.pitchId;

        var pitchRef = new Firebase("https://nuskin.firebaseio.com/pitches/" + pitchId);
        var userRef = new Firebase("https://nuskin.firebaseio.com/users/" + userId);

        pitchRef.on("value", function(snapshot) {
            var pitch = snapshot.val();
            $rootScope.pitch = pitch;
            userRef.on("value", function(userSnapshot) {
                $rootScope.pitch.sponsor = userSnapshot.val();

                $rootScope.bar = $rootScope.pitch.bar;
                $state.go('card', {'index': 1});

            });
        });


})

    .controller('ForgotPasswordCtrl', function($scope){

    })

    .controller('OfficeCtrl', function($scope, $ionicHistory, $rootScope, $state){
        $rootScope.showSponserHeader = false;


        $scope.logout = function(){

            var ref = new Firebase("https://nuskin.firebaseio.com");
            ref.unauth();
            alert(ref.getAuth());
            $state.go('loading');
        }

        $scope.clearBroadcasts = function(){
            var locationRef = new Firebase("https://nuskin.firebaseio.com/locations");
            locationRef.set({}, success());

        }

    })

    .controller('SimpleCheckoutCtrl', function($scope,$state, ShopService, $ionicActionSheet, _){
        $scope.products = ShopService.getCartProducts();

        $scope.removeProductFromCart = function(product) {
            $ionicActionSheet.show({
                destructiveText: 'Remove from cart',
                cancelText: 'Cancel',
                cancel: function() {
                    return true;
                },
                destructiveButtonClicked: function() {
                    ShopService.removeProductFromCart(product);
                    $scope.products = ShopService.getCartProducts();
                    return true;
                }
            });
        };

        $scope.getSubtotal = function() {
            return _.reduce($scope.products, function(memo, product){ return memo + product.price; }, 0);
        };

        $scope.begin = function(){
            $state.go('loading');

        }

        $scope.goToOffice = function(){
            $state.go('office');

        }



    })


    .controller('LoadingCtrl', function($scope, $ionicLoading, $timeout, $rootScope, $state, $ionicNavBarDelegate){

       /* $ionicLoading.show({
            duration: 30000,
            noBackdrop: true,
            template: '<p class="item-icon-left">Finding Sponsor...<ion-spinner icon="lines"/></p>'
        });*/

        $rootScope.loggingin = false;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                var lat = Math.round(position.coords.latitude * 10);
                var long =  Math.round(position.coords.longitude * 10);
                var geoLoc = "loc" + lat + "x" + long;
                var pitchRef = new Firebase("https://nuskin.firebaseio.com/locations/" + encodeURI(geoLoc));

                pitchRef.on("value", function(snapshot) {

                    if(!$rootScope.loggingin){
                        var pitch = snapshot.val();
                        $rootScope.pitch = pitch;
                        console.log("Added item to rootscope", $rootScope.pitch);
                        $rootScope.bar = pitch.bar;
                        $rootScope.sponsorImg = 'img/' + pitch.sponsor.imgURL;
                        console.log($rootScope.sponsorImg);
                        $rootScope.showSponserHeader = true;
                        $ionicLoading.hide();
                        $state.go('card', {'index': 1});

                    }

                });

            });
        }


        $scope.goToLogin = function(){
            //alert("hello");
            $rootScope.loggingin = true;
            $state.go('login');
        }



    })

;
