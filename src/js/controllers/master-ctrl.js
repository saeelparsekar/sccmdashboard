/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore','$http', MasterCtrl]);

function MasterCtrl($scope, $cookieStore,$http) {
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

	$http.get("http://10.244.46.53:3300/getTotalTweets")
        .then(function(results){console.log(results.data.totalTweets);
			 $scope.totalTweets = results.data.totalTweets;
	}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

	/* $http.get("http://10.244.46.53:3300/getGenderLocation")
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
	$http.get("http://10.244.46.53:3300/getTodaysTweets")
        .then(function(results){
			 $scope.todaysTweets = results.data.todaysTweetsCount;
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });
	
     $http.get("http://10.244.46.53:3300/getWords")
        .then(function(results){
		$scope.skills = results.data;

		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });


		
	$http.get("http://10.244.46.53:3300/getStackeddata")
        .then(function(results){
		$scope.dataStackedArea = results.data;
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });
		
	$http.get("http://10.244.46.53:3300/getMostInfluentialTweet")
        .then(function(results){console.log(results.data);
			$scope.influentialUsers = results.data.influentialUsers;

		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

	
	$http.get("http://10.244.46.53:3300/getBardata")
        .then(function(results){			
		$scope.dataBar = results.data;
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });

	 $http.get("http://10.244.46.53:3300/getGenderRatio")
        .then(function(results){console.log(results.data);
			 $scope.dataDonut = results.data;	
		}, function(results){
            //error
            console.log("Error: " + results.data + "; "
                                  + results.status);
        });
	 $scope.isSunburstDataLoading = true;
	 $http.get("http://10.244.46.53:3300/getGenderLocation")
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
                return d3.format(',.4f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
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



	
	
	
	




