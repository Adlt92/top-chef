//import
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
//initialisation des variable
var urlsearch = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
//permet de cherher le nombre de page total des resultats
function Scraping(){
  //count the number of result page
  var pagef = 0;
  request(urlsearch, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('li.mr-pager-item').each(function(i, element){
        var a = $(this).prev();
        var num = parseInt(a.text());
        if(num > pagef){
          pagef = num;
        }
      });
    }
    ScannerPage(pagef);
  });
}

function ScannerPage(page_max){
  //scan each page to hyave the link of page
  var jsons = [];
  for (i = 1; i <= page_max; i++)
  {
    var url = urlsearch + '/page-' + i;
    request(url, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('[attr-gtm-type="poi"]').each(function(i, element){
          var name_resto = $(this).attr('attr-gtm-title');
          var link =  $(this).children().attr('href');
          var json =  {name : "", url: ""};
          json.name = name_resto;
          json.url = link;
          jsons.push(json);
        });
      }
      fs.writeFile('link_resto.json', JSON.stringify(jsons, null, 4), function(err){
      })
    });
  }
  console.log('Scraping successfull !');
}


Scraping();
