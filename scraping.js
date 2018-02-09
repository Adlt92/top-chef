//import
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
//var jsonfile = require('jsonfile');
//initialisation des variable
var urlsearch = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
//var num_page;
//permet de cherher le nombre de page total des resultats
function Scraping(){
  console.log('start');
  //count the number of result page
  var pagef = 0;
  request(urlsearch, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('li.mr-pager-item').each(function(i, element){
        var num = parseInt($(this).text());
        if(num > pagef){
          pagef = num;
        }
      });
    }
    console.log('there is ', pagef, ' pages of results');
    ScannerPage(pagef);
  });
}


function ScannerPage(page_max){
  console.log('scanner page');
  //scan each page to hyave the link of page
  var jsons = [];
  num_page = page_max;
  var num_resto = 0;
  for (i = 1; i <= page_max; i++)
  {
    var url = urlsearch + '/page-' + i;
    request(url, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('[attr-gtm-type="poi"]').each(function(i, element){
          var json =  {name : "", url: ""}
          json.name = $(this).attr('attr-gtm-title');
          json.url =  $(this).children().attr('href');
          jsons.push(json);
        });
      }
      fs.writeFile('link_resto.json', JSON.stringify(jsons, null, 4), function(err){})
    });
  }
  console.log('Scraping successfull !');
  ExtractData(615);
}

function ExtractData(nbr_resto){
  console.log('extract data from');
  var json_file = [];
  var jsons = [];
  nbr_resto = 615;
  //extract the data from link_resto.json
  fs.readFile('link_resto.json', function readFileCallback(err, data){
    if (err){
      console.log(err);
    }
    else {
      json_file = JSON.parse(data);
      //scraping each retaurant in France
      for (i = 0; i < nbr_resto; i++){
        console.log(i, nbr_resto, json_file[i].url);
        var url = 'https://restaurant.michelin.fr' + json_file[i].url;
        request(url, function (error, response, html){
          if (!error && response.statusCode == 200){
            var $ = cheerio.load(html);
            var json =  {name :"", etoile:"", note:"", type_cuisine:"", prix_min:"", prix_max:"", code_postal:"", ville:"", adresse: ""};

            //var note = $('div.poi_intro-description opt-upper__intro-area').html();
            //console.log('note', note);
            //prix
            var prix = $('div.poi_intro-display-prices').text();
            json.prix_min = prix.substring(19,22);
            json.prix_max = prix.substring(26,30);
            //autres info
            $('[itemprop="address"]').each(function(i, element){
              var name = $(this).prev().prev().text();
              json.name = name.substring(7,name.length -4);
              var type = $(this).next().text();
              json.type_cuisine = type.substring(7,type.length -4);
              //adress
              var adresse = $(this).children().children().children().children();
              json.adresse = $(adresse).children().eq(0).text();
              json.code_postal = $(adresse).next().children().eq(0).text();
              json.ville = $(adresse).next().children().next().text();
            });
            jsons.push(json);
          }
          //save the data in a json file
          fs.writeFile('info_resto.json', JSON.stringify(jsons, null, 4), function(err){});
        });
      }
    }
  });
  console.log('Saving sucessfull !');
}

Scraping();
//ExtractData(1);
