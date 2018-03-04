//import
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');		


function scrapID(nn, callback){
	var json_file = [];
	//extract the data from link_resto.json
	fs.readFile('info_resto.json', function readFileCallback(err, data){
	  if (err){
		console.log(err);
	  }
	  else {
		json_file = JSON.parse(data);
		var nbr_resto = json_file.length-1;
		//scraping each retaurant in France
  
		for (i = 0; i < nbr_resto; i++){
			var urlsearch = "https://m.lafourchette.com/api/restaurant-prediction?name=" + json_file[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
		  	var json = json_file[i];
		  	search2(urlsearch, json, function(new_json) {
				  json_file[i] = new_json;
				  fs.writeFile('info_resto.json', JSON.stringify(json_file, null, 4), function(err){});
				});
			var string = "scraping " + i + " done !";
		  	callback(string);
		}
	  }
	});
}

function search2(url_s, json_fi, callback){
	request({url: url_s, json : true}, function (error, response, body){
		if(body != null){
			try{
				if(body.length > 0){
					body.forEach(function(element){
						if(element.address.postal_code == json_fi.localisation.zipcode){
							json_fi.fourchette.id = element.id;
						}
			});
				}
			} catch(error){
				console.log(error);
			}
		}
		callback(json_fi);
	  });
}

function scrapO(name_file_in, callback){
	var json_file = [];
	fs.readFile('info_resto.json', function readFileCallback(err, data){
		if (err){
			console.log(err);
		}
		else {
			json_file = JSON.parse(data);
			var nbr_resto = json_file.length-1;
			for (i = 0; i < nbr_resto; i++){
				var json = json_file[i];
				if(json.fourchette.id != ''){
					var urlsearch = "https://m.lafourchette.com/api/restaurant/" + json.fourchette.id + "/sale-type";
					req(urlsearch, json, function(new_json) {
						json_file[i] = new_json;
						fs.writeFile('info_resto.json', JSON.stringify(json_file, null, 4), function(err){});
					});
				}
				callback();
			}
		}
	});
}

function req(url_s, json_fi, callback){
	  request({url: url_s, json : true}, function (error, response, body){
		if(body != null){
			try{
				if(body.length > 0){
					body.forEach(function(element){
						if(element.is_special_offer == true){
							json_fi.fourchette.offre.title = element.title;
							json_fi.fourchette.offre.description = element.description;
						}
					});
				}
			} catch(error){
				console.log(error);
			}
		}
		callback(json_fi);
	  });
}


function scrapingFourchette(){
	console.log("start la fourchette")
	var name_file_in = 'info_resto.json';
	scrapID(name_file_in, function() {
		scrapO('info_resto.json', function(){});
	});
}

setTimeout(scrapingFourchette,3 * 60 * 1000);