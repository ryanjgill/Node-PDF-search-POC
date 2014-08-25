var express = require('express');
var app = express();
var pdfText = require('pdf-text');
var _ = require('lodash');
var $ = require('jquery');
var fs = require('fs');
var async = require('async');


app.use(express.static(__dirname + '/'));


app.get('/search/:id', function (req, res) {

	var id = req.params.id.split(' ').join('');

	fs.readdir(__dirname + '/PDFs/', function (err, files){
		
		var pdfs = _.filter(files, function (f) {
			return f.indexOf('.pdf') > -1;
		});

	  var mathchingPdfs = [];
	  var matchingChunks = [];
	  var count = 0;
	  var length = pdfs.length;
		var inputVal = id;
		var outName = "";

		console.log('searchTerm: ' + inputVal);

		// loop over the pdfs and find ones that contain the search value
		async.each(pdfs, function (pdf, next) {
			var pathToPdf = __dirname + "/PDFs/" + pdf;
			
			pdfText(pathToPdf, function(err, chunks) {
			if (err) {
				res.statusCode = 400;
				res.send(err.message);
			}

			  //chunks is an array of strings 
			  //loosely corresponding to text objects within the pdf	  
			  var _chunks = chunks.join('').toLowerCase().split(' ').join('');


			  if (_chunks.indexOf(inputVal.toLowerCase()) > -1) {
			  	// push the match onto the array of matching pdfs
			  	mathchingPdfs.push(pdf);
			  	matchingChunks.push(_chunks);
			  	
			  	count++;

					console.log("Found a match! " + count + " of " + length);
					
					next();
			  }
			  else {
			  	count++;

			  	console.log("No match found " + count + " of " + length);
			  	
			  	next();	
			  }
			});
			
			
		}, function (error) {
			console.log("Results: " + mathchingPdfs.length + " of " + length + " PDFs matched");
			// when done with async each, send the results
			res.send({
				id: id,
				matches: mathchingPdfs,
				chunks: matchingChunks,
				totalFiles: length
			});
		});

	});	

});


app.listen(3000); //the port you want to use
console.log('App is ready and listening on port: 3000');


