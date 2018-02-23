//import
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');		


function scrapID2(nn, callback){
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

function scrapName(name_file_in, callback){
	fs.readFile(name_file_in, function readFileCallback(err, data){
		if (err){
			console.log(err);
		}
		else {
			json_file = JSON.parse(data);
			var nbr_resto = json_file.length;
			for (i = 0; i < nbr_resto; i++){
				if(json_file[i].fourchette.id != null){
					var urlsearch = "https://m.lafourchette.com/api/restaurant/" + json_file[i].id;
					request(urlsearch, function (error, response, results){
						if(results.length > 0){
							results.forEach(function(resto){
								var name_normalisation = resto.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
								name_normalisation = name_normalisation.replace(/'/g, "-");
								name_normalisation = name_normalisation.replace(/ /g, "-");
								json_file[i].fourchette.name = name_normalisation.toLowerCase();
							});
						}
						fs.writeFile('info_resto.json', JSON.stringify(jsons, null, 4), function(err){});
					});
				}
			}
		}
		callback();
	});
}

function scrapOffre(name_file_in, callback){
	fs.readFile(name_file_in, function readFileCallback(err, data){
		if (err){
			console.log(err);
		}
		else {
			json_file = JSON.parse(data);
			var nbr_resto = json_file.length;
			for (i = 0; i < nbr_resto; i++){
				if(json_file[i].fourchette.id != null){
					var urlsearch = "https://www.lafourchette.com/restaurant/" + json_file[i].fourchette.name + "/" + json_file[i].fourchette.id;
					request(urlsearch, function (error, response, results){
						if(results.length > 0){
						//class  div  saleType saleType--specialOffer
						//titre h3 saleType-title
						//description p 
							results.forEach(function(resto){
								if(resto.address.postal_code == json_file[i].zipcode){
									json_file[i].id = resto.id;
								}
							});
						}
					});
				}
			}
		}
		callback();
	});
}

function scrapingFourchette(interval){
	var name_file_in = 'info_resto.json';
	//appel la fonction tt les jours
	//setTimeout(scrapingFourchette, interval);
	scrapID2(name_file_in, function() {
		
	});
}

var time = 24*60*60*1000;
//scrapingFourchette(time);
scrapID2('info_resto.json', function(){});