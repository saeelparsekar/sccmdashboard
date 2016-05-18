
angular.module('RDash').directive('rdWorldCloud', function(){
 

 var directive={};
 directive.restrict = 'E';



 directive.scope = {
        data : '='
    }

 
 directive.link = function (scope,element,attributes) {

     
     scope.$watchCollection('data', function (val) {
              
                    //find the previous element and remove it if it already exists..
                    var divElement = angular.element(element[0].querySelector('svg'));
                    divElement.remove();
                    
                    
                    
                   //code to create a word cloud  
     var frequency_list =scope.data;

    var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

    d3.layout.cloud().size([500, 200])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();
 
 function draw(words){
     d3.select("#abc").empty();
     d3.select("#abc").append("svg")
                .attr("width", "100%")
                .attr("height", "422px")
                .attr("class", "")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(250,220)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
				
			
				}
                    
                    
                    
                    
                    
                });
     
     

 


   
	} ;
 


	return directive;
	});
