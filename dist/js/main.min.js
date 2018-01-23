
//    console.log("Jquery running");
   
//    function getData(){
//     $.get( "http://starlord.hackerearth.com/gamesarena", function( data ) {
//         //$( ".result" ).html( data );
//         var games="";
//         gameData=data;
//         data.forEach((element,index) => {
//             //console.log("Elememt :",element+" Index:",index);
//             if(index!=0)
//             {
//             games+=`<div class="col-md-3">
//               <div class="card" style="width: 18rem;">
//                 <img class="card-img-top" src="images/pokeball.svg" alt="Card image cap" style="height: 10rem;>
//                     <div class="card-body">
//                         <h5 class="card-title">${element.title}</h5>
//                         <div class="card-text-body">
//                             <p class="card-text"><span><i class="fa fa-tablet" aria-hidden="true"></i></span> <span>${element.platform}</span></p>
//                             <p class="card-text"><i class="fa fa-tablet" aria-hidden="true"></i> ${element.platform}</p>
//                             <p class="card-text"><i class="fa fa-tablet" aria-hidden="true"></i> ${element.platform}</p>
//                         </div>
//                     </div>
//                 </div>
//                 </div>`;
//             }          

//         });

//         //console.log("Template:",games);

//         $(".game-list").empty().append(games);
//         // /console.log(data);
//         //alert( "Load was performed." );
//         $("#searchInput").val('Life');
//         gameData=autoComplete($("#searchInput"));
//       });
//    }

//    var gameData;

//    function autoComplete($this){
//     console.log($this.val());
//     var inputValue=$this.val();
//     return showSearchedGames(gameData.filter(el=>{
//         console.log(el);
//         return ((el.hasOwnProperty('title') && el['title'].indexOf(inputValue)));
//     }));
//    }

   
//    function showSearchedGames(autoCompleteData){
//     $("#searchInput").parent().find('ul').empty().append(autoCompleteData);
//    }

//    $("#searchInput").change((e)=>{
//     console.log($(this));
//     var inputValue=$(this).val();
//     return showSearchedGames(gameData.filter(el=>{
//         if(el.title.indexOf(inputValue));
//     }));
//    });

//   getData();   

   var app = angular.module('myApp', []);

   app.controller('game-list-controller', function($scope,GameListService) {
    $scope.gameList=[];    
    $scope.gameOrderBy='title';
    GameListService.getGamesData().then(
             response=>{$scope.gameList=response;
            //console.log($scope.gameList);
            }
        );
        //console.log($scope.gameList);
    });

    app.controller('search-controller', function($scope,GameListService) {
        $scope.gameList=[];
        GameListService.getGamesData().then(
            response=>{$scope.gameList=response;
               //console.log($scope.gameList);
           }
       );
        $scope.searchValue = '';
        $scope.isFocussed=false;
    });
    
   app.service('GameListService',function($http) {
    this.gameListData;
    
    this.getGamesData=function(){
        return $http.get("http://starlord.hackerearth.com/gamesarena")
        .then(function (response) {
            this.gameListData=response.data;
            console.log(response.data);
            return response.data;
        });
       // return null;
    }
           
   });