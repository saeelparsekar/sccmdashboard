//import express package
var express = require("express");

//import mongodb package
var mongodb = require("mongodb");

//MongoDB connection URL - mongodb://host:port/dbName
var dbHost = "mongodb://10.51.234.135:27017/smcc";

//DB Object
var dbObject;

//get instance of MongoClient to establish connection
var MongoClient = mongodb.MongoClient;

//Connecting to the Mongodb instance.
//Make sure your mongodb daemon mongod is running on port 27017 on localhost
MongoClient.connect(dbHost, function(err, db){
  if ( err ) throw err;
  console.log(err);
  console.log("Succesfuly connected");
  dbObject = db;
});


function getCampaign(responseObj) {
dbObject.collection('socialfact').aggregate([
  { $group : { _id : "$campaign",count: { $sum: 1 }  }  }
]).toArray(function(err, docs){
    	
	if ( err ) throw err;
	var c = 0;
	var dataset = [];
	for ( index in docs){		
      var doc = docs[index];
     c = c+1;
	 dataset.push({"label" :doc['_id']});
	 dataset.push({"value" :doc['count']});
    }
  
   var response = {
	  "type" : "Campaign",
      "total_campaign" : c,
	  "dataset" : dataset
    };
	
	//console.log(dataset);
    responseObj.json(response);   
  });

}

function getWords(responseObj){
dbObject.collection('wordcount').aggregate([
   { $match: { count: { $gte: 100 } } },
    { $group: {_id: "$word", counter: {$first: "$count"}} },   
    {$limit:500},
]).toArray(function(err, docs){
    	
	if ( err ) throw err;
	var c = 0;
	var dataset = [];
	for ( index in docs){		
      var doc = docs[index];
     c = c+1;
        
       var randNumber =  Math.floor(Math.random() * 8) + 1;
        var relevancy =  Math.floor(Math.random() * 6) + 1;
      
        if(relevancy > randNumber){
            var temp = randNumber;
            randNumber = relevancy;
            relevancy = temp;
        }
     
    if(doc['_id'] != null && doc['_id'] != ""){    
     var outString = doc['_id'].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');          
     dataset.push({"name" : outString,"years" :randNumber,"relevancy" :relevancy});
    }
    }
  

   var response = dataset;
	
	//console.log(dataset);
    responseObj.json(response);   
  });    
}


function getLocation(responseObj) {
dbObject.collection('socialfact').aggregate([
  { $group : { _id : "$dataplace",count: { $sum: 1 }  }  }
]).toArray(function(err, docs){
    	
	if ( err ) throw err;
	var c = 0;
	var dataset = [];
	for ( index in docs){		
      var doc = docs[index];
     c = c+1;
	 dataset.push({"label" :doc['_id']});
	 dataset.push({"value" :doc['count']});
    }
  

   var response = {
	  "type" : "Location",
      "total_location" : c,
	  "dataset" : dataset
    };
	
	//console.log(dataset);
    responseObj.json(response);   
  });



}

function getGender(responseObj) {
dbObject.collection('socialfact').aggregate([
  {$project: {
    male: {$cond: [{$eq: ["$gender", "M"]}, 1, 0]},
    female: {$cond: [{$eq: ["$gender", "F"]}, 1, 0]},
    Unisex: {$cond: [{$eq: ["$gender", "U"]}, 1, 0]},
  }},
  {$group: { _id: null, male: {$sum: "$male"},
                        female: {$sum: "$female"},
                         unisex: {$sum: "$Unisex"},
                        total: {$sum: 1},
  }},
]).toArray(function(err, docs){
    	
	if ( err ) throw err;

	for ( index in docs){
		
      var doc = docs[index];
     
    }
    var dataset = [
      {
        "label" : "Male",
        "value" : doc['male']
      },
      {
        "label" : "Females",
        "value": doc['female']
      },
	  {
        "label" : "Unknown",
        "value": doc['unisex']
      },
	  {
        "label" : "Total",
        "value": doc['total']
      }
    ];

    var response = {
	  "type" : "Gender",
	  "total_male" : doc['male'],
	  "total_female" : doc['female'],
	  "total_unknown" : doc['unisex'],
	  "total" : doc['total'],
      "dataset" : dataset
    };
    responseObj.json(response);
  });
}

//bar graph data
function getBardata(responseObj) {
dbObject.collection('socialfact').aggregate([
    { $match: { count: { $gte: 10 } } },
    { $group: {_id: "$dataplace", counter: {$first: "$count"}} },   
    { $sort : { counter : -1} },
	{$limit:6}, //showing only five but 6 is limit cuz unknown comes up at top always!!
]).toArray(function(err, docs){
//form the data in required format for stacked chart
if ( err ) throw err;
	var dataset = [];
	var child = [];
	var editeditems = [];
    var c = 0;
	
for ( index in docs){		
      var doc = docs[index];
        c = c+1;	
		if( doc['_id'] != 'unknown') {
		child.push({"label" : doc['_id'],"value" : doc['counter']});
        }
}
	child.sort(function (a, b) {return Math.random() - 0.5;});
	editeditems.push({
		key: "Locationwise Tweet Count",
		"values": child
		});  
	
//send the response
var response = editeditems;
    responseObj.json(response);
});

}	
 
//


function getStackeddata(responseObj) {

dbObject.collection('socialfact').aggregate([
    
    /*{ "$group": {
        "_id": {
            "date": "$post_time",
            "gender": "$gender",
            "tweetcount": "$count"
           
        }    
    }},
    { "$group": {
        "_id": "$_id.gender",
        "DataSet": { 
            "$addToSet": { 
                "date": "$_id.date",
                "tweetcount":"$_id.tweetcount",
               
               
            },
        },
       
    }},
  { "$sort": { "count": -1 } }, 
])*/


   
    { "$group": {
        "_id": {
            "date": "$post_time",
            "gender": "$gender",
            "tweetcount": "$count"
           
        }    
    }},
    { "$group": {
        "_id": "$_id.gender",
        "DataSet": { 
            "$addToSet": { 
                "date": "$_id.date",
                "tweetcount":"$_id.tweetcount",
               
               
            },
        },
       
    }},
  { "$sort": { "count": -1 } }, 
]).toArray(function(err, docs){
//form the data in required format for stacked chart
if ( err ) throw err;
	var dataset = [];
	var child = [];
	var editeditems = [];
for (index in docs){
	var settings = [];
	var doc = docs[index];
	for ( C in doc['DataSet']){
		var d = doc['DataSet'][C];
		var childrens=[];
		var dateTime = d['date'];
		settings.push([dateTime,d['tweetcount']]);
							
	}			
	if(doc['_id'] != "U") {
	editeditems.push({		
		"key": doc['_id'],
		"values": settings
		});  
	}
}

//send the response
var response = editeditems;
    responseObj.json(response);
});

}	

function getGenderRatio(responseObj) {
dbObject.collection('socialfact').aggregate([
  {$project: {
    male: {$cond: [{$eq: ["$gender", "M"]}, 1, 0]},
    female: {$cond: [{$eq: ["$gender", "F"]}, 1, 0]}
  }},
  {$group: { _id: null, male: {$sum: "$male"},
                        female: {$sum: "$female"}
  }},
]).toArray(function(err, docs){
    	
	if ( err ) throw err;

	for ( index in docs){
		
      var doc = docs[index];
     
    }
    var dataset = [
      {
        "key" : "Male",
        "y" : doc['male']
      },
      {
        "key" : "Females",
        "y": doc['female']
      }
    ];

    var response = dataset;
    responseObj.json(response);
  });
}

function getTotalTweets(responseObj) {
  
  dbObject.collection('socialdata').count(function(err, count){
	 responseObj.json({ totalTweets: count}); 
  });    
  
}

function getTodaysTweets(responseObj) {
		dbObject.collection('socialfact').find(
		{"post_time": {"$gte":  new Date('2016-04-21T00:00:00.000Z')}}).toArray(function(err, docs){
			responseObj.json({ 'todaysTweetsCount': docs.length}); 
		});
  
}
function getMostInfluentialTweet(responseObj) {
	dbObject.collection('socialdata').find().sort({followerCount: -1}).limit(3).toArray(function(err, docs){
		responseObj.json({ 'influentialUsers': docs}); 
	});
}

function getGenderLocation(responseObj) {
dbObject.collection('socialdata').aggregate([
    { $match:{$or:[{gender :{ $eq: 'F' }},{gender : {$eq:'M'}}]}},
    { "$group": {
        "_id": {
            "location": "$dataPlace",
            "gender": "$gender",
           
        },
        "names":{ "$addToSet": {"username":"$contributorName","tweetcount": "$userPostCount"}},
       
        "totalCount": { "$sum": 1 }
    }},
    { "$group": {
        "_id": "$_id.gender",
        "Locations": { 
            "$addToSet": { 
                "loc": "$_id.location",
                "count": "$totalCount",
                "names": "$names",
               
               
            },
        },
        "count": { "$sum": "$totalCount" }
    }},
    
    
    { "$sort": { "count": -1 } },
	{$limit:100},
]).toArray(function(err, docs){   	
	if ( err ) throw err;
	var dataset = [];
	var child = [];
	var editeditems = [];
for (index in docs){
	var settings = [];
	var doc = docs[index];
	for ( C in doc['Locations']){
		var d = doc['Locations'][C];
		var childrens=[];
		for(E in d['names']){			
		 var f = d['names'][E];
			childrens.push({
				"name": f['username'],
				"size": f['tweetcount'],
			});
		}
		if(d['loc'] != 'unknown') {
		settings.push({
							"name": d['loc'],
							"size": d['count'],
							"children" : childrens
					 });
	}	}		
	if(doc['_id'] != "U") {
	editeditems.push({		
		"name": doc['_id'],
		"children": settings
		});  
	}
}
    var response = {
	  "name" : "kitkat",
      "children":editeditems
    };
    responseObj.json(response);
  });
}	
 
 //word count query 
 function getCount(responseObj) {
    dbObject.collection('wordcount').aggregate([
    { $match: { count: { $gte: 100 } } },
    { $group: {_id: "$word", count: {$first: "$count"}} },   
    {$limit:100},
	]).toArray(function (err, docs) {
     var dataset=[];

    for (i = 0; i < docs.length; i++) {
	   dataset.push({"text" : docs[i]._id,
					"size":  docs[i].count%40
					});	   
   }   
        responseObj.json(dataset);
    })
}
 

 
//create express app
var app = express();

app.get("/getGender", function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getGender(res); 
});


app.get("/getGenderRatio", function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getGenderRatio(res); 
});

app.get("/getLoc", function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getLocation(res); 
});

app.get("/getGenderLocation", function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getGenderLocation(res); 
});


app.get("/getCampaign", function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getCampaign(res); 
});

app.get("/getStackeddata", function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getStackeddata(res); 
});

app.get("/getBardata", function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getBardata(res); 
});

app.get("/getWords", function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getWords(res); 
});
app.get("/getTotalTweets", function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getTotalTweets(res); 
});
app.get("/getTodaysTweets", function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getTodaysTweets(res); 
});

app.get("/getMostInfluentialTweet", function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getMostInfluentialTweet(res); 

});

app.get("/getCount", function(req, res){
console.log("calling get count");
	res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  getCount(res); 
  
});


app.listen("3300", function(){
  console.log('Server up: http://localhost:3300');
});