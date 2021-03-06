var Document = require( 'pelias-model' ).Document;
var logger = require( 'pelias-logger' ).get( 'geographicnames' );
var categoryMapping = require( '../../metadata/category_mapping.json' );
var through2 = require('through2');

module.exports = {};

module.exports.create = function() {
  return through2.obj(function(data, enc, next) {
    var record;
    try {

      let layer = data.layer || 'venue';
      record = new Document( 'geographicnames', layer, data.uni )
        .setName( 'default', data.full_name_ro.trim() )
        .setCentroid({
          lat: data.lat,
          lon: data.long
        });

      try {
        var population = parseInt(data.pop, 10);
        if (population) {
          record.setPopulation( population );
        }
      } catch( err ){}

      if( typeof data.dsg === 'string' ){
        record.setMeta( 'fcode', data.dsg );

        var featureCode = data.dsg.toUpperCase();
        if( categoryMapping.hasOwnProperty( featureCode ) ){
          var peliasCategories = categoryMapping[ featureCode ];
          peliasCategories.forEach( function ( category ){
            record.addCategory( category );
          });
        }
      }

    } catch( e ){
      logger.warn(
        'Failed to create a Document from:', data, 'Exception:', e
      );
    }

    if( record !== undefined ){
      this.push( record );
    }
    next();
  });
};
