//import
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


var urlsearch = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
//var num_page;

function SearchNbrPage(callback){
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
    callback(pagef);
  });
}

function ScanUrl(page_max, callback){
  //scan each page to hyave the link of page
  var jsons = [];
  for (i = 1; i <= page_max; i++)
  {
    var url = urlsearch + '/page-' + i;
    request(url, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('[attr-gtm-type="poi"]').each(function(i, element){
          var json =  {name : "", url : "", etoile : "", note : "", type_cuisine : "", prix_min : "", prix_max : "", localisation : {address : "", zipcode : "", ville : "" }, fourchette : {id : "", name : "", offre : {title : "", description : ""} }};
          json.name = $(this).attr('attr-gtm-title');
          json.url =  $(this).children().attr('href');
          jsons.push(json);
        });
      }
      fs.writeFile('info_resto.json', JSON.stringify(jsons, null, 4), function(err){})
      callback();
    });
  }
  
}

function ExtractData(){
  var json_file = [];
  var jsons = [];
  //extract the data from link_resto.json
  fs.readFile('info_resto.json', function readFileCallback(err, data){
    if (err){
      console.log(err);
    }
    else {
      json_file = JSON.parse(data);
      var nbr_resto = 5;//json_file.length-1;
      //scraping each retaurant in France
      for (i = 0; i < nbr_resto; i++){
        var url = 'https://restaurant.michelin.fr' + json_file[i].url;
        request(url, function (error, response, html){
          if (!error && response.statusCode == 200){
            var $ = cheerio.load(html);
            //prix
            var prix = $('div.poi_intro-display-prices').text();
            json_file[i].prix_min = prix.substring(19,22);
            json_file[i].prix_max = prix.substring(26,30);
            //autres info
            $('[itemprop="address"]').each(function(i, element){
              var name = $(this).prev().prev().text();
              json_file[i].name = name.substring(7,name.length -4);
              var type = $(this).next().text();
              json_file[i].type_cuisine = type.substring(7,type.length -4);
              //localisation
              var adresse = $(this).children().children().children().children();
              json_file[i].localisation.address = $(adresse).children().eq(0).text();
              json_file[i].localisation.zipcode = $(adresse).next().children().eq(0).text();
              json_file[i].localisation.ville = $(adresse).next().children().next().text();
            });
          }
          console.log(json_file[i]);
          //save the data in a json file
          fs.writeFile('info_resto.json', JSON.stringify(jsons, null, 4), function(err){});
        });
      }
    }
  });
}

function Scraping(){
  console.log('start');
  var nbr_page = SearchNbrPage();
  console.log('there is ', nbr_page, ' pages of results');
  console.log('scanner page');
  ScanUrl(nbr_page);
  console.log('Scraping successfull !');
  console.log('extract data');
  ExtractData();
  console.log('Saving sucessfull !');
}

Scraping();