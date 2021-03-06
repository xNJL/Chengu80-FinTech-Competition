
var app = angular.module('mainApp', ['ngRoute']);

var username = "Dummy";

var issuer = "Random";

var baseAddress = "file:///home/swufe/Desktop/UI/Chengdu/ui/index.html#!/";

var load = function(){
	window.location.reload();
}

$(document).ready(function(){
	if(localStorage.getItem('loggedIn')==null){
		localStorage.setItem('loggedIn', false);
	}else if(localStorage.getItem('loggedIn')==true){
		$(".only-investor").show();
	}else{
		$(".only-investor").hide();
	}
});

app.config(['$routeProvider', function($routeProvider){
		$routeProvider.
		when('/', {templateUrl: 'screens/login.html', controller: 'loginController'}).
		when('/login', {templateUrl: 'screens/login.html', controller: 'loginController'}).
		when('/register', {templateUrl: 'screens/register.html', controller: 'registerController'}).
		when('/register_issuer', {templateUrl: 'screens/register_issuer.html', controller: 'RICntrl'}).
		when('/portfolio', {templateUrl: 'screens/portfolio.html', controller: 'pCntrl'}).
		when('/invest', {templateUrl: 'screens/invest.html', controller: 'iCntrl'}).
		when('/issuer', {templateUrl: 'screens/issuer.html', controller: 'issuerCntrl'}).
		when('/ipo_profile', {templateUrl: 'screens/ipoProfile.html', controller: 'ipoProfContrl'}).
		when('/execute_ipo', {templateUrl: 'screens/execute_ipos.html', controller: 'executeCntrl'});
	}]);

app.controller("pCntrl", function($scope, $http){

	var element = document.getElementById("mfooter");
	element.classList.remove("fixed-bottom");

	var element = document.getElementById("mfooter");
	element.classList.add("fixed-bottom");
	$http.get("http://127.0.0.1:5000/"+username+"/bids")
		 .then(function(response){
			 var jsondata = response.data.current_bids;
			 $scope.bids = jsondata;
		 });
	
	$http.get("http://127.0.0.1:5000/"+username+"/holdings")
		 .then(function(response){
			 var jsondata = response.data.portfolio;
			 $scope.holdings = jsondata;
		 });
	});

// TODO: Unfinished controller for invest view
app.controller("iCntrl", function($scope, $http){
	var element = document.getElementById("mfooter");
	element.classList.remove("fixed-bottom");
	var url = "http://127.0.0.1:5000/ipos";
	var currentIndex = 0;
	var itemsPerView = 6;
	var jsonq = null;
	
	$http.get(url).then(function(response){
		console.log(response.data);
		jsonq = jsonQ(response.data).find('invest').value()[0];
		$scope.profiles = jsonq.slice(currentIndex, itemsPerView);
	});

	$scope.nextPage = function() {
		console.log("next "+$scope.profiles);
		console.log($scope.profiles);
		if(currentIndex + itemsPerView < jsonq.length){
			currentIndex = currentIndex + itemsPerView;
			$scope.profiles = jsonq.slice(currentIndex, currentIndex + itemsPerView);
		}else{
			$scope.profiles = jsonq.slice(currentIndex, jsonq.length);
		}
	}

	$scope.prevPage = function() {
		if(currentIndex - itemsPerView >= 0){
			currentIndex = currentIndex - itemsPerView;
			$scope.profiles = jsonq.slice(currentIndex, currentIndex + itemsPerView);
		}else if(jsonq.length < itemsPerView){
			$scope.profiles = jsonq.slice(0, jsonq.length);
		}else{
			$scope.profiles = jsonq.slice(0, itemsPerView);
			currentIndex = 0;
		}
	}

	$scope.goToProfile = function(name) {
		localStorage.setItem("IPO",name);
		window.location.replace(baseAddress+"ipo_profile");
	}
});

app.controller('loginController', function($scope, $http){
	var element = document.getElementById("mfooter");
	element.classList.add("fixed-bottom");
	$("#registerInvestorButton").on("click", function(){window.location.replace(baseAddress+"register");});
	$("#registerIssuerButton").on("click", function(){window.location.replace(baseAddress+"register_issuer");});
	$scope.submitFunc = function() {
		var url = "http://127.0.0.1:5000/login/investor";
		var data = {"username": $scope.username, "password": $scope.password};
		username = $scope.username;
		postData(url, data, loginHandler);
	}
});

app.controller('registerController', function($scope, $http){
	var element = document.getElementById("mfooter");
	element.classList.add("fixed-bottom");
	$scope.passwordMatch = function(){
		if($scope.password !== $scope.confPassword){
			alert("Password Mismatch");
		}
	}

	$scope.submitFunc = function() {
		var url = "http://127.0.0.1:5000/register/investor";
	    var data = { 'firstName': 		$scope.firstName,
	        		'lastName': 		$scope.lastName,
	        		'email': 			$scope.email,
	        		'username': 		$scope.username,
	        		'password': 		$scope.password,
	        		'confpassword': 	$scope.confpassword}
		postData(url, data, registerHandler);
	}
});

app.controller('RICntrl', function($scope, $http){

	var element = document.getElementById("mfooter");
	element.classList.remove("fixed-bottom");
	$scope.passwordMatch = function(){
		if($scope.password !== $scope.confPassword){
			alert("Password Mismatch");
		}
	}

	$scope.submitFunc = function() {
		var url = "http://127.0.0.1:5000/"+$scope.firstName+"/issuer";
		issuer = $scope.firstName;
		fullname = $scope.firstName+" "+$scope.lastName;
		var data = { "age":parseInt($scope.age,10),
					 "marital_status":parseInt($scope.marital_status,10),
					 "sex":parseInt($scope.gender,10),
					 "number_of_kids": parseInt($scope.no_of_kids,10),
					 "occupation":parseInt($scope.occupation,10),
					 "education_level":parseInt($scope.education_level,10),
					 "house_tenure":parseInt($scope.no_of_kids,10),
					 "income_past12months": parseFloat($scope.income),
					 "intended_education": parseInt($scope.q2,10),
					 "graduation_year": parseInt($scope.gradyear,10),
					 "intended_occupation": parseInt($scope.int_occupation,10)
					};
		postData(url, data, registerInvestorHandler);
		alert("Please press the next link below to continue to your profile!");
	}
});

app.controller('issuerCntrl', function($scope, $http){

	
	
	var url = "http://127.0.0.1:5000/"+issuer+"/issuer";
	$http.get(url)
		 .then(function(response){
			 var jsondata = response.data;
			 console.log(jsondata);
			 var g = new factorMap();
			 $scope.name = fullname;
			 $scope.age = jsondata.age;
			 $scope.gender = g.getValue("sex",jsondata.sex);
			 $scope.marital_status = g.getValue("marital_status",jsondata.marital_status);
			 $scope.education_level = g.getValue("education_level",jsondata.education_level);
			 $scope.curr_occupation = g.getValue("occupation",jsondata.occupation);
			 $scope.int_occupation = g.getValue("intended_occupation",jsondata.intended_occupation);
			 $scope.house_tenure = g.getValue("house_tenure",jsondata.house_tenure);
			 $scope.no_of_kids = jsondata.number_of_kids;
			 $scope.income = jsondata.income_past12months;
		 })

		var suggested_price = function(){
			var s_url = "http://127.0.0.1:5000/"+issuer+"/suggested_price";
			$http.get(s_url)
				 .then(function(response){
					 $scope.share_price = response.data.share_price;
					 $scope.call = response.data.K_call;
					 $scope.put = response.data.K_put;
				 })
		}

	 $scope.submitFunc = function(){
		var sp_url = "http://127.0.0.1:5000/"+issuer+"/ipo";
		var data = {
			"credit_card_percentage":0.02,
			"shares_offering":1000,
			"market_lot":1,
			"minimum_order":0,
			"call_option":2,
			"put_option":0,
			"date": "2018-20-10"
		};
		postData(sp_url, data, issuerHandler);
		suggested_price();
	}

	$scope.min_Price = function(){
		var sp_url = "http://127.0.0.1:5000/"+issuer+"/prices";
		var data = {
			"suggested_price": $scope.share_price,
			"minimum_price": $scope.minPrice,
			"call_price": $scope.call,
			"put_price": $scope.put
		};
		postData(sp_url, data, issuerHandler);
		alert("We have recieved your details. We will keep you updated on your IPO status. Feel free to email us if you have any query. ");
	}

	
});

app.controller('ipoProfContrl', function($scope, $http){

	var element = document.getElementById("mfooter");
	element.classList.remove("fixed-bottom");
	$scope.name = {
		name: localStorage.getItem("IPO")
	};
	$("#iInfo").hide();

	var url1 = "http://127.0.0.1:5000/"+$scope.name.name+"/issuer";
	var url2 = "http://127.0.0.1:5000/"+$scope.name.name+"/ipo";
	var url3 = "http://127.0.0.1:5000/"+$scope.name.name+"/prices";

	var currentIndex = [0,0];
	var itemsPerView = [4,4];
	var infoState = 0;

	var info = [[
		'name',
		'age',
		'sex',
		'occupation',
		'number_of_kids',
		'marital_status',
		'education_level',
		'graduation_year',
		'house_tenure',
		'avg_credit_card_spending_semi_annual',
		'income_past12months',
		'intended_education',
		'intended_occupation'
		],
		 [
		'shares_offering',
		'credit_card_percentage',
		'date',
		'minimum_order',
		'market_lot',
		'put_option',
		'call_option'
		]];
	var codeValues = [
		'occupation',
		'intended_occupation',
		'education_level',
		'intended_education',
		'house_tenure',
		'sex',
		'marital_status'
		];

	$http.get(url1).then(function(response){
		var map = new factorMap();
		for(var i = 0; i<codeValues.length; i++){
			response.data[codeValues[i]] = map.getValue(codeValues[i], response.data[codeValues[i]]);
		}
		$scope.profileInfo = response.data;
		console.log($scope.profileInfo);
		$scope.keys = info[infoState].slice(currentIndex[infoState], itemsPerView[infoState]);
	});

	$http.get(url2).then(function(response){
		$scope.ipoInfo = response.data;
		console.log($scope.ipoInfo);
		$scope.keys = info[infoState].slice(currentIndex[infoState], itemsPerView[infoState]);
	});
	
	$http.get(url3).then(function(response){
		$scope.priceInfo = response.data;
		console.log($scope.priceInfo);
	});

	$scope.nextPage = function() {
		if(currentIndex[infoState] + itemsPerView[infoState] < info[infoState].length){
			currentIndex[infoState] = currentIndex[infoState] + itemsPerView[infoState];
			$scope.keys = info[infoState].slice(currentIndex[infoState], currentIndex[infoState] + itemsPerView[infoState]);
		}else{
			$scope.keys = info[infoState].slice(currentIndex[infoState], info[infoState].length);
		}
	}

	$scope.prevPage = function() {
		if(currentIndex[infoState] - itemsPerView[infoState] >= 0){
			currentIndex[infoState] = currentIndex[infoState] - itemsPerView[infoState];
			$scope.keys = info[infoState].slice(currentIndex[infoState], currentIndex[infoState] + itemsPerView[infoState]);
		}else if(info[infoState].length < itemsPerView[infoState]){
			$scope.keys = info[infoState].slice(0, info[infoState].length);
		}else{
			$scope.keys = info[infoState].slice(0, itemsPerView);
			currentIndex[infoState] = 0;
		}
	}

	$scope.showIpoInfo = function() {
		console.log("show ipo");
		$("#pInfo").hide();
		$("#iInfo").show();
		infoState = Math.abs(infoState -1);
		currentIndex = [0,0];
		itemsPerView = [4,4];
	}

	$scope.showPersonalInfo = function() {
		console.log("show personal");
		$("#iInfo").hide();
		$("#pInfo").show();
		infoState = Math.abs(infoState -1);
		currentIndex = [0,0];
		itemsPerView = [4,4];
	}

	$scope.postBid = function() {
		console.log("post bid");
		var url = "http://127.0.0.1:5000/"+username+"/bid";
		var bid = $("#bidPrice").val();
		var numShares = $("#numShares").val();
		var data = {
			'price': 	bid,
			'amount':	numShares,
			'issuer':	localStorage.getItem("IPO")
		}
		$http.post(url, data).then(function(response){
			alert(response.data.message);
		});
	}
});

app.controller("executeCntrl", function($scope, $http){
	var element = document.getElementById("mfooter");
	element.classList.add("fixed-bottom");
	$http.get("http://127.0.0.1:5000/ipos")
		 .then(function(response){
			 var jsondata = response.data.invest;
			 console.log(jsondata);
			 $scope.ipos = jsondata;
		 });

	$scope.executeIPO = function(){
		var ex_url = "http://127.0.0.1:5000/P100006/execute";
		$http.get(ex_url)
			 .then(function(response){
				 console.log(response);
				 alert(response.data.message);
			 });
	}
});
