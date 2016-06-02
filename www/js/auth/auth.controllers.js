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

.controller('CreateAccountCtrl', function($scope, $state, $firebaseAuth,  $rootScope, FlowService){

        if($rootScope.pitch == undefined){
            $state.go('loading');
        }


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
            FlowService.forward();
        }).catch(function(error) {
            console.error("Error: ", error);
        });


	};

        $scope.onSwipeRight = function(){
            FlowService.back();
        }


    $scope.createCustomerAccount = function() {

        var data = JSON.stringify({
            "SponsorID": "US9062933",
            "CountryCode": "US",
            "BEType": "CUST",
            "Login": {
                "ID": $scope.signupData.email,
                "Password": "abc123",
                "PasswordHint": "abc123"
            },
            "Person": {
                "Name": [
                    {
                        "Type": "LOCAL",
                        "Given": $scope.signupData.name.split(' ').slice(0, -1).join(' '),
                        "Family": $scope.signupData.name.split(' ').slice(-1).join(' ')
                    }
                ],
                "Address": {
                    "Street1": $scope.signupData.street,
                    "City": $scope.signupData.city,
                    "Region": $scope.signupData.stateCd,
                    "PostalCode": $scope.signupData.postal,
                    "CountryCode": "US"
                }
            }
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                console.log(this.responseText);
            }
        });

        xhr.open("POST", "https://test.nuskin.com/account-service/api/v1/account");
        xhr.setRequestHeader("client_id", "75e9a0cd9fae49aeb565a01c2bb0df5c");
        xhr.setRequestHeader("client_secret", "a522d7b86a0f4f008FDA15E3E605BF22");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("authorization", "Basic Ym9iOmJvYnNwYXNzd29yZA==");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("postman-token", "be5809f1-5fec-c224-5ddb-6b831e1cb59c");

        xhr.send(data);

    }


    $scope.onSwipeRight = function(){
        FlowService.back();
    }
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


  .controller('SimpleCtrl', function($scope, $state, $stateParams, CardService, $rootScope, FlowService){


      $rootScope.showSponserHeader = true;

      $scope.index = $stateParams.index;

        if($rootScope.pitch == undefined){
            $state.go('loading');
        }

       var card = $rootScope.pitch.cards[$stateParams.index];


      $scope.background = "img/cards/" + card.bgImage;



      $scope.onSwipeLeft = function(){
          FlowService.forward();
      }


      $scope.onSwipeRight = function(){
          FlowService.back();

      }

  })
    .controller('ProductCardCtrl', function($scope, $rootScope,$stateParams, ShopService, $state,$ionicPopup, $ionicLoading, FlowService) {


        if($rootScope.pitch == undefined){
            $state.go('loading');
        }

        var productId = $rootScope.pitch.cards[$rootScope.index].productId;

        ShopService.getProduct(productId).then(function(product){
            $scope.product = product;
            ShopService.addProductToCart(product);
        });



        $scope.onSwipeLeft = function(){
            FlowService.forward();
        }


        $scope.onSwipeRight = function(){
            FlowService.back();
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

            $rootScope.showSponserHeader = true;
            window.history.back();
        }


    })

    .controller('StarterKitCtrl', function($scope, FlowService) {

        $scope.onSwipeLeft = function(){
            FlowService.forward();
        }


        $scope.onSwipeRight = function(){
            FlowService.back();
        }


    })
    .controller('BingoCtrl', function($scope, $stateParams, PostService, $ionicHistory, $state, $ionicScrollDelegate, $ionicModal, $rootScope) {

        $rootScope.showSponserHeader = false;

        $scope.back = function (){
            $rootScope.showSponserHeader = true;
            window.history.back();
        }

    })
    .controller('PitchesCtrl', function($scope, ShopService, $ionicModal, $state, $rootScope){


        var name = "Sally Smith";

        var ref = new Firebase("https://nuskin.firebaseio.com");
        var authData = ref.getAuth();


        if($rootScope.user){
            name = $rootScope.user.name;
        }else{
            console.log("No User");
        }
        //$scope.products = ShopService.getCartProducts();



        var myPitchesRef = new Firebase("https://nuskin.firebaseio.com/users/" + authData.uid + "/pitches" );

        $scope.mypitches = [];
        myPitchesRef.on('value', function(snap) {

            $scope.mypitches = snap.val();

        });


        var pitches = [
            {
                "name": "peppermint",
                "id": 0,
                "cards": [
                    {
                        "bgImage": "temp.png",
                        "template": "simple"
                    },
                    {
                        "bgImage": "two.png",
                        "template": "simple"
                    },
                    {
                        "bgImage": "three.png",
                        "template": "simple"
                    },
                    {
                        "bgImage": "four.png",
                        "template": "simple"
                    },
                    {
                        "bgImage": "four.png",
                        "template": "simple"
                    },
                    {
                        "productId": "0",
                        "template": "product"
                    },
                    {
                        "template": "customer-account"
                    },
                    {
                        "template": "simple-checkout"
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
                "id": 1,
                "cards": [
                    {
                        "bgImage": "temp.png",
                        "template": "simple"
                    },
                    {
                        "bgImage": "two.png",
                        "template": "simple"
                    },
                    {
                        "bgImage": "2-three.png",
                        "template": "simple"
                    },
                    {
                        "bgImage": "2-four.png",
                        "template": "simple"

                    },
                    {
                        "productId": "0",
                        "template": "product"
                    },
                    {
                        "template": "customer-account"
                    },
                    {
                        "template": "simple-checkout"
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
            cssClass: 'edit-pitch-popup',
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.pitchDialog = modal;
        });


        $ionicModal.fromTemplateUrl('views/auth/cards/modals/new-pitch.html', {
            cssClass: 'edit-pitch-popup',
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.newPitchDialog = modal;
        });



        $ionicModal.fromTemplateUrl('views/auth/cards/edit/customer-account.html', {
            cssClass: 'edit-pitch-popup',
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.prefillDialog = modal;
        });



        $scope.selectPitch = function(id, pitch){
            pitch.id = id;
            $scope.pitch = pitch;
            $scope.pitchDialog.show();

        }

        $scope.createPitchDialog = function(){

            $scope.newPitchDialog.show();
        }


        $scope.share = function(pitch){

            window.plugins.socialsharing.share('Rediscover natural ways to live better',
                pitch.name,
                'img/epoch.jpeg',
               // 'http://pedro-nuskin.s3-website-us-west-2.amazonaws.com/#/p/' + pitch.id + '/' + authData.uid);
                'http://nuskin.io/#/p/' + pitch.id + '/' + authData.uid);


        }


        $scope.shareApp = function(pitch){

            if(!authData.uid){
                alert("not logged in");
            }

            window.Branch.link({
                channel: 'sms',
                feature: 'share',
                data: {
                    "+pitch_id": pitch.id,
                    "+sponsor_id": authData.uid,
                    "$og_title": "Pitch",
                    "$og_image_url": "mysite.com/image.png",
                    "$desktop_url": "mysite.com/article1234"
                }
            }, function(err, link) {
                if (!err) {
                    window.plugins.socialsharing.share('Rediscover natural ways to live better',
                        pitch.name,
                        'img/epoch.jpeg',
                        link);
                }else{
                    alert("error getting link" + err);
                }
            });


        }





        $scope.edit = function(pitch){

            $rootScope.editPitch = pitch;
            $scope.pitchDialog.hide();
            $state.go('edit-pitch');

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

        $scope.newPitch = {};
        $scope.newPitch.name = "";

        $scope.createPitch = function(){


            var newPitch = {
                "name": $scope.newPitch.name,
                "owner": "Jim Bob",
                "bar": "bar-balanced",
                "cards":[],
                "sponsor": {
                    "imgURL": "dean.png",
                    "name": $rootScope.user.name,
                    "title": "Blue Diamond",
                    "description": "Thisisthedescription"
                }
            };

           var pitchesRef = new Firebase("https://nuskin.firebaseio.com/users/" + authData.uid + "/pitches");
            var newRef =  pitchesRef.push(newPitch);


           // var userPitchesRef = new Firebase("https://nuskin.firebaseio.com/users/" + authData.uid + "/pitches/" + newID +"/id");
            //userPitchesRef.set({"name": $scope.newPitch.name, "id": newID});
            $scope.newPitchDialog.hide();
        }


        $scope.backToOffice = function(){
            $state.go('office');
        }


    })

.controller('PitchCtrl', function($scope,$stateParams, $rootScope, $state, FlowService ){

        var userId = $stateParams.userId;
        var pitchId = $stateParams.pitchId;
        FlowService.loadPitch(userId, pitchId);

})

    .controller('NSCheckoutCtrl', function($scope, $stateParams, $rootScope, $state, ShopService ){

        var url = "https://ww.nuskin.com/content/nuskin/en_US/cart.html?orderSkus=";

        var products = ShopService.getCartProducts();
        products.forEach( function (product)
        {
            var x = arrayItem.prop1 + 2;
            alert(x);
        });





    })


    .controller('ForgotPasswordCtrl', function($scope){

    })
    .controller('MyWhyCtrl', function($scope, FlowService){
        $scope.onSwipeLeft = function(){
            FlowService.forward();
        }


        $scope.onSwipeRight = function(){
            FlowService.back();
        }
    })
    .controller('OfficeCtrl', function($scope, $ionicHistory, $rootScope, $state){


        if($rootScope.user === null || $rootScope.user === undefined){


            var ref = new Firebase("https://nuskin.firebaseio.com");
            var authData = ref.getAuth();




            var userRef = new Firebase("https://nuskin.firebaseio.com/users/" + authData.uid);

            userRef.on("value", function(snapshot) {

                $rootScope.user = snapshot.val();
            });

        }


        $rootScope.showSponserHeader = false;


        $scope.logout = function(){
            var ref = new Firebase("https://nuskin.firebaseio.com");
            ref.unauth();
            $state.go('loading');
        }

        $scope.clearBroadcasts = function(){
            var locationRef = new Firebase("https://nuskin.firebaseio.com/locations");
            locationRef.set({}, function(data){console.log("broadcasts clear")});
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


    .controller('LoadingCtrl', function($scope, $ionicLoading, $timeout, $rootScope, $state, FlowService){

        /*

        if(window.localStorage.initilized){
            FlowService.loadPitchByGeo();
        }
        */


        $scope.goToLogin = function(){
            $rootScope.loggingin = true;
            $state.go('login');
        }



    })

;
