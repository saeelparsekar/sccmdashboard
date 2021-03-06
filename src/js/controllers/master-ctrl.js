/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore','$http','$q', MasterCtrl]);

function MasterCtrl($scope, $cookieStore,$http,$q) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;
    
    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

	var totalTweets = $http.get("http://10.51.234.148:3300/getTotalTweets")
        .then(function(results){console.log(results.data.totalTweets);
			 $scope.totalTweets = results.data.totalTweets;
	}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

	/* $http.get("http://10.51.234.148:3300/getGenderLocation")
        .then(function(results){
		 $scope.dataSunburst = [results.data];
	
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });
	*/
	var todaysTweets = $http.get("http://10.51.234.148:3300/getTodaysTweets")
        .then(function(results){
			 $scope.todaysTweets = results.data.todaysTweetsCount;
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });
	
    /* $http.get("http://10.51.234.148:3300/getWords")
        .then(function(results){
		$scope.skills = results.data;

		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });
	*/
	
		
	var getCount = $http.get("http://10.51.234.148:3300/getCount")
        .then(function(results){
			$scope.cloudData= results.data;
			$scope.filterData = results.data;
   
             $scope.flag = true;

	},function(error){
	
	console.log("ERROR"+error);
	$scope.flag=false;
	
	
	}); 
	
	//filters data 
	    $scope.cloudFilter = function(text){     
        console.log(text);
		var dataStore =[];
       if(text == null){
         $scope.filterData = $scope.cloudData;
        return filterData;   
       }
       else{

       var str;
        for(i=0;i<$scope.cloudData.length;i++){
           str = $scope.cloudData[i].text;
            if(str) {
               if(str.indexOf(text) !=-1){
				dataStore.push($scope.cloudData[i]);
           
               }
            }
       }
         
  $scope.filterData = dataStore;
      
   }
   };
   // end
	
	
		
	/*$http.get("http://10.51.234.148:3300/getStackeddata")
        .then(function(results){
		$scope.dataStackedArea = results.data;
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });*/
		
	var influentialTweet = $http.get("http://10.51.234.148:3300/getMostInfluentialTweet")
        .then(function(results){console.log(results.data);
			$scope.influentialUsers = results.data.influentialUsers;

		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

	
	var getBarData = $http.get("http://10.51.234.148:3300/getBardata")
        .then(function(results){			
		$scope.dataBar = results.data;
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

	 var getGenderRation = $http.get("http://10.51.234.148:3300/getGenderRatio")
        .then(function(results){console.log(results.data);
			 $scope.dataDonut = results.data;	
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });
	 $scope.isSunburstDataLoading = true;
	 var getGenderLocation = $http.get("http://10.51.234.148:3300/getGenderLocation")
        .then(function(results){
			$scope.isSunburstDataLoading = false;
			 $scope.dataSunburst = [
				results.data
			];	

		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

	
    // Bar chart
    $scope.optionsBar = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function(d){ return d.label; },
            y: function(d){ return d.value; },
            showValues: true,
            valueFormat: function(d){
                return d3.format("")(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'Countries'
            },
            yAxis: {
                axisLabel: 'Tweet Count',
                axisLabelDistance: 30
            }
        }
    };


    // Pie charts
    $scope.optionsPie = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: true,
            transitionDuration: 500,
            labelThreshold: 0.01,
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    $scope.dataPie = [
        {
            key: "One",
            y: 5
        },
        {
            key: "Two",
            y: 2
        },
        {
            key: "Three",
            y: 9
        },
        {
            key: "Four",
            y: 7
        },
        {
            key: "Five",
            y: 4
        },
        {
            key: "Six",
            y: 3
        },
        {
            key: "Seven",
            y: .5
        }
    ];


    // Stacked area
    $scope.optionsStackedArea = {
        chart: {
            type: 'stackedAreaChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 40
            },
            x: function(d){return d[0];},
            y: function(d){return d[1];},
            useVoronoi: false,
            clipEdge: true,
            transitionDuration: 500,
            useInteractiveGuideline: true,
            xAxis: {
                showMaxMin: false,
                tickFormat: function(d) {
                    return d;
                }
            },
            yAxis: {
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
                }
            }
        }
    };
	
    // Sunburst
    $scope.optionsSunburst = {
        chart: {
            type: 'sunburstChart',
            height: 450,
            color: d3.scale.category20c(),
            transitionDuration: 250
        }
    };
	
	 $scope.optionsDonut = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                
                duration: 500,
                legend: {
                    margin: {
                        top: 5,
                        right: 70,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

 
}



	
	
	
	




