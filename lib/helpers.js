var df = require('vendor/dateformat');

var helpers = module.exports = {

  authorslug: function () {
    return this.author.replace(/[^\w]/g, '').toLowerCase();
  },

  published: function () {
    var date = new Date(this.published_at.slice(0,3).join('/'));
      //, time = this.published_at.slice(3,6).join(':');

    return df(date, 'dddd mmmm dS, yyyy'); 
  },

  toDate: function (arr) {
    return new Date(arr.slice(0,3).join('/') + ' '
                  + arr.slice(3,6).join(':'));
  }
}
