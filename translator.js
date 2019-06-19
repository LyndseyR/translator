const html = require('./file');
const cheerio = require('cheerio');
const $ = cheerio.load(html);
var stringSimilarity = require('string-similarity');
const fs = require('fs');
var CsvReadableStream = require('csv-reader');
var AutoDetectDecoderStream = require('autodetect-decoder-stream');
lang = "pt";

(function () {
  let count = 0;
  let translationsSet = [];
  var inputStream = fs.createReadStream('./Product.csv').pipe(new AutoDetectDecoderStream({
    defaultEncoding: '1255'
  }));
  inputStream
    .pipe(CsvReadableStream({
      parseNumbers: true,
      parseBooleans: true,
      trim: true
    }))
    .on('data', function (row) {
console.log(row);
      translationsSet.push({
        en: row[0].replace('\n', ""),
        zh: row[1].replace('\n', ""),
        ja: row[2].replace('\n', ""),
        ko: row[3].replace('\n', ""),
        fr: row[4].replace('\n', ""),
        de: row[5].replace('\n', ""),
        it: row[6].replace('\n', ""),
        es: row[7].replace('\n', ""),
        pt: row[8].replace('\n', "")
      });

    })
    .on('end', function (data) {

      buildPages()
      const fs = require('fs');
      fs.writeFile("./overview/" + lang + ".html", $('body').html(), function (err) {
        if (err) {
          return console.log(err);
        }

        console.log("The file was saved!");
      });
    });

  function buildPages() {
    let $rhtrans = $('.rh-trans');

    $rhtrans.each((idx, rhtranselem) => {
      var string = $(rhtranselem).text();
      var translated = false;

      translationsSet.forEach((elem, idx) => {
        if (stringSimilarity.compareTwoStrings(elem.en.toLowerCase(), string.toLowerCase()) > .95 && !translated) {
          translated = true;
          count++;
          $(rhtranselem).html(elem[lang]);
        }


      })

      if (translated == false) {
        console.log(string);
      }

    })
  }




})()