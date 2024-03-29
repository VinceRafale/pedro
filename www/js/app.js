angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});



var onResume = function() {
  window.Branch.init('key_test_flpGUS7FifTtYfqYqyPvhackDqbU0UbQ');
};


angular.module('your_app_name', [
  'ionic',
  'ngIOS9UIWebViewPatch',
  'your_app_name.common.directives',
  'your_app_name.app.controllers',
  'your_app_name.auth.controllers',
  'your_app_name.edit.controllers',
  'your_app_name.app.services',
  'your_app_name.views',
  'underscore',
  'firebase',
  'angularMoment'
])


// Enable native scrolls for Android platform only,
// as you see, we're disabling jsScrolling to achieve this.
.config(function ($ionicConfigProvider) {
  if (ionic.Platform.isAndroid()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
})

.run(function($ionicPlatform, $rootScope,$state, $ionicHistory, $firebaseObject, CardService, FlowService) {

  $rootScope.bar = "bar-light";


  $ionicPlatform.ready(function() {

    if(window.Branch){
      window.Branch.init('key_test_flpGUS7FifTtYfqYqyPvhackDqbU0UbQ');

    }



    document.addEventListener('resume', onResume, false);

    FlowService.init();

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //SIDE MENU ROUTES
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.feed', {
    url: "/feed",
    views: {
      'menuContent': {
        templateUrl: "views/app/feed.html",
        controller: "FeedCtrl"
      }
    }
  })

  .state('app.profile', {
    abstract: true,
    url: '/profile/:userId',
    views: {
      'menuContent': {
        templateUrl: "views/app/profile/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.profile.posts', {
    url: '/posts',
    views: {
      'profileContent': {
        templateUrl: 'views/app/profile/profile.posts.html'
      }
    }
  })

  .state('app.profile.likes', {
    url: '/likes',
    views: {
      'profileContent': {
        templateUrl: 'views/app/profile/profile.likes.html'
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/profile/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('app.shop', {
    url: "/shop",
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/shop.html"
      }
    }
  })

  .state('app.shop.home', {
    url: "/",
    views: {
      'shop-home': {
        templateUrl: "views/app/shop/shop-home.html",
        controller: 'ShopCtrl'
      }
    }
  })

  .state('app.shop.popular', {
    url: "/popular",
    views: {
      'shop-popular': {
        templateUrl: "views/app/shop/shop-popular.html",
        controller: 'ShopCtrl'
      }
    }
  })

  .state('app.shop.sale', {
    url: "/sale",
    views: {
      'shop-sale': {
        templateUrl: "views/app/shop/shop-sale.html",
        controller: 'ShopCtrl'
      }
    }
  })

  .state('app.cart', {
    url: "/cart",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/cart.html",
        controller: 'ShoppingCartCtrl'
      }
    }
  })

  .state('app.shipping-address', {
    url: "/shipping-address",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/shipping-address.html",
        controller: "CheckoutCtrl"
      }
    }
  })

  .state('app.checkout', {
    url: "/checkout",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/checkout.html",
        controller: "CheckoutCtrl"
      }
    }
  })

  .state('app.product-detail', {
    url: "/product/:productId",
    views: {
      'menuContent': {
        templateUrl: "views/app/shop/product-detail.html",
        controller: 'ProductCtrl'
      }
    }
  })


  //AUTH ROUTES
  .state('facebook-sign-in', {
    url: "/facebook-sign-in",
    templateUrl: "views/auth/facebook-sign-in.html",
    controller: 'WelcomeCtrl'
  })

  .state('dont-have-facebook', {
    url: "/dont-have-facebook",
    templateUrl: "views/auth/dont-have-facebook.html",
    controller: 'WelcomeCtrl'
  })

  .state('create-account', {
    url: "/create-account",
    templateUrl: "views/auth/create-account.html",
    controller: 'CreateAccountCtrl'
  })

  .state('welcome-back', {
    url: "/welcome-back",
    templateUrl: "views/auth/welcome-back.html",
    controller: 'WelcomeBackCtrl'
  })



      .state('login', {
        url: "/login",
        templateUrl: "views/auth/login.html",
        cache: false,
        controller: "LoginCtrl"

      })


    .state('simple', {
        url: "/simple/:index",
        templateUrl: "views/auth/cards/simple.html",
        controller: 'SimpleCtrl',
        cache: false
      })


      .state('product', {
        url: "/product/:productId",
        templateUrl: "views/auth/cards/product.html",
        cache: false,
        controller: 'ProductCardCtrl'
      })

      .state('starter-kit', {
        url: "/starter-kit",
        templateUrl: "views/auth/cards/starter-kit.html",
        cache: false,
        controller: 'StarterKitCtrl'
      })

      .state('customer-account', {
        url: "/customer-account",
        templateUrl: "views/auth/cards/customer-account.html",
        controller: "CreateAccountCtrl"
      })

      .state('loading', {
        url: "/loading",
        templateUrl: "views/auth/cards/loading.html",
        cache: false,
        controller: "LoadingCtrl"


      })

      .state('mywhy', {
        cache: false,
        url: "/mywhy",
        templateUrl: "views/auth/cards/profile.html",
        controller: "MyWhyCtrl"


      })
      .state('video', {
        cache: false,
        url: "/video",
        templateUrl: "views/auth/cards/video.html",
        controller: "MyWhyCtrl"


      })


      .state('sponsor', {
        url: "/sponsor",
        templateUrl: "views/auth/cards/sponsor.html",
        cache: false,
        controller: "SponsorCtrl"


      })
      .state('bingo', {
        url: "/bingo",
        templateUrl: "views/auth/cards/bingo.html",
        controller: "BingoCtrl"


      })

      .state('pitches', {
        url: "/pitches",
        templateUrl: "views/auth/cards/pitches.html",
        cache: false,
        controller: "PitchesCtrl"


      })

      .state('community-pitches', {
        url: "/community-pitches",
        templateUrl: "views/auth/cards/community-pitches.html",
        cache: false,
        controller: "PitchesCtrl"

      })

      .state('corp-pitches', {
        url: "/corp-pitches",
        templateUrl: "views/auth/cards/corp-pitches.html",
        cache: false,
        controller: "PitchesCtrl"

      })

      .state('office', {
        cache: false,
        url: "/office",
        templateUrl: "views/auth/office.html",

        controller: "OfficeCtrl"


      })

      .state('simple-checkout', {
        url: "/simple-checkout",
        templateUrl: "views/auth/cards/simple-checkout.html",
        cache: false,
        controller: "SimpleCheckoutCtrl"

      })

      .state('p', {
        url: "/p/:pitchId/:userId",
        templateUrl: "views/auth/cards/loading-pitch.html",
        cache: false,
        controller: "PitchCtrl"

      })



  //EDIT_ROUTES
      .state('edit-pitch', {
        url: "/edit-pitch",
        templateUrl: "views/auth/cards/edit/pitch-cards.html",
        cache: false,
        controller: "EditPitchCtrl"

      })


;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loading');
  // $urlRouterProvider.otherwise('/app/feed');
})

;
