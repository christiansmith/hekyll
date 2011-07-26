/**
var helpers = require('../lib/helpers')

describe('helpers', function() {
  describe('date', function() {
    beforeEach(function() {
      date = helpers.toDate([2011, 7, 25, 12, 30, 15]);
    });
    
    it('should convert a date array into a date object', function() {
      expect(date instanceof Date).toBeTruthy();
    });
  });  

  describe('path', function() {
    it('should build a url from a request object', function() {
      expect(url).toEqual('http://host:port/path?query=value');
    }); 
  });  
});  
*/
