
var csv = require('csv');

var parser = function( mergeOptions, transform )
{
  var options = {
    delimiter: '\t',
    comment: '#',
    quote: null,
    trim: true
  };

  for( var attr in mergeOptions ) {
    options[attr] = mergeOptions[attr];
  }

  var stream = csv().from.options( options );
  var outputStream = stream.transform( transform );

  stream.resume();
  return outputStream;
}

module.exports = parser;