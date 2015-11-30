angular.module('your_app_name.edit.controllers', [])


.controller('EditPitchCtrl', function($scope, $state, $ionicModal, $rootScope){
	// $scope.bgs = ["http://lorempixel.com/640/1136"];

        var ref = new Firebase("https://nuskin.firebaseio.com");
        var authData = ref.getAuth();



        $scope.cards = [
            {
                "bgImage": "temp.png",
                "name": "simple",
                "template": "simple",
                "icon": "simple.png"
            },
            {
                "template": "video",
                "name": "Video",
                "icon": "video.png"
            },
            {
                "name": "product",
                "productId": "0",
                "template": "product",
                "icon": "product.png"
            },
            {
                "template": "starter-kit",
                "name": "Starter Kit",
                "icon": "starter-kit.png"
            },
            {
                "template": "mywhy",
                "name": "About Me",
                "icon": "mywhy.png"
            },

            {
                "template": "customer-account",
                "name": "Create Account",
                "icon": "customer-create.png"
            },
            {
                "template": "simple-checkout",
                "name": "Check Out",
                "icon": "cart.png"
            }

        ]

        if($rootScope.editPitch.cards === undefined){
            $rootScope.editPitch.cards = [];
        }

    $scope.editPitch = $rootScope.editPitch;





        $scope.showReorder = false;
        $scope.listCanSwipe = true;
        $scope.moveItem = function(item, fromIndex, toIndex) {
            $scope.editPitch.cards.splice(fromIndex, 1);
            $scope.editPitch.cards.splice(toIndex, 0, item);


            save($scope.editPitch);
        };

        $scope.deleteItem = function(item) {
            $scope.editPitch.cards.splice($scope.editPitch.cards.indexOf(item), 1);
            save($scope.editPitch);
        };



        $ionicModal.fromTemplateUrl('views/auth/cards/edit/modals/add-card.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addCardDialog = modal;
        });

        $scope.addCard = function (){
            $scope.addCardDialog.show();
        }

        $scope.addSelectedCard = function(card){
            $rootScope.editPitch.cards.push(card);

           save($rootScope.editPitch);
            $scope.addCardDialog.hide();

        }


        var save = function(pitch){
            var pitchRef = new Firebase("https://nuskin.firebaseio.com/users/" + authData.uid + "/pitches/" + $scope.editPitch.id);
            var updatePitch = pitch;
            for (var i in updatePitch.cards) {
                delete updatePitch.cards[i].$$hashKey;
            }
            pitchRef.set(updatePitch);

        }

        $scope.done = function(){
            $state.go("pitches");

        }

        $scope.preview = function(){
            $state.go("pitches");
        }


})
;