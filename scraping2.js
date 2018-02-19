//import
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');		
						
function scrapID(){
	fs.readFile(name_file_in, function readFileCallback(err, data){
		if (err){
			console.log(err);
		}
		else {
			json_file = JSON.parse(data);
			for (i = 0; i < nbr_resto; i++){
				var urlsearch = "https://m.lafourchette.com/api/restaurant-prediction?name=" + json_file[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
				request(urlsearch, function (error, response, results){
					if(result.length > 0){
						result.forEach(function(resto){
							if(resto.address.postal_code == json_file[i].zipcode){
								json_file[i].fouchette.id = resto.id;
							}
						});
					}
					fs.writeFile('info_resto.json', JSON.stringify(jsons, null, 4), function(err){});
				});
			}
		}
	});
}

function scrapName(){
	fs.readFile(name_file_in, function readFileCallback(err, data){
		if (err){
			console.log(err);
		}
		else {
			json_file = JSON.parse(data);
			for (i = 0; i < nbr_resto; i++){
				var urlsearch = "https://m.lafourchette.com/api/restaurant/" + json_file[i].id;
				request(urlsearch, function (error, response, results){
					if(result.length > 0){
						result.forEach(function(resto){
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
	});
}

function scrapOffre(){
	fs.readFile(name_file_in, function readFileCallback(err, data){
		if (err){
			console.log(err);
		}
		else {
			json_file = JSON.parse(data);
			for (i = 0; i < nbr_resto; i++){
				var urlsearch = "https://www.lafourchette.com/restaurant/" + json_file[i].fourchette.name + "/" + json_file[i].fourchette.id;
				request(urlsearch, function (error, response, results){
					if(result.length > 0){
						//class  div  saleType saleType--specialOffer
						//titre h3 saleType-title
						//description p 
						result.forEach(function(resto){
							if(resto.address.postal_code == json_file[i].zipcode){
								json_file[i].id = resto.id;
							}
						});
					}
				});
			}
		}
	});
}

function scrapingLaFourchette(){
	var name_file_in = 'info_resto.json';
	var name_file_out = 'lafourchette.json';
	scrapID(name_file_in, name_file_out);
	scrapName(name_file_in, name_file_out);
	scrapOffre(name_file_in, name_file_out);
	Console.log("finish");
}

scrapingLaFourchette();