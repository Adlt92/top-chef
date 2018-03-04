//const michelin = require("./scraping.js");
const lafourchette = require("./scraping2.js");
var fs = require('fs');	

var delai_ms = 6 * 60 * 1000;

//michelin;

lafourchette;

//setTimeout(AffichageResultats, delai_ms); 

function AffichageResultats(){
    console.log("affichage");
    var json_file = [];
	//extract the data from link_resto.json
	fs.readFile('info_resto.json', function readFileCallback(err, data){
	  if (err){
		console.log(err);
	  }
	  else {
		json_file = JSON.parse(data);
		var nbr_resto = json_file.length-1;
		for (i = 0; i < nbr_resto; i++){
            if(json_file[i].fourchette.offre.title != ''){
                console.log("le restaurant: "+ json_file[i].name + " propose une offre : " +  json_file[i].fourchette.offre.title + " : " + json_file[i].fourchette.offre.description);
            }
		}
	  }
	});

}