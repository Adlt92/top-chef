//import
var request = require('request');
var cheerio = require('cheerio');
//initialisation des variable
var urlsearch = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
//permet de cherher le nombre de page total des resultats
function SearchNbrPage(){
  var pagef = 10;
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
    scraping(pagef);
  });
}

function scraping(page_max){
  console.log(page_max);
  for (i = 1; i <= page_max; i++)
  {
    url = urlsearch + '/page-' + i;
    console.log(url);
    request(url, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('poi_card-display-title').each(function(i, element){
          var a = $(this).prev();
          var num = parseInt(a.text());
          if(num > pagef){
            pagef = num;
          }
        });
      }
    });
  }
}

//permet de saugarder les données sur un format json pour un restaurant
function SaveData(){

}

SearchNbrPage();
