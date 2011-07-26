var Doc = require('notch').Doc
  , df = require('dateformat')
  , md = require('discount')
  , fs = require('fs');


var Post = Doc.extend({

  write: function (file) {
    var src = this.markdown || '';
    delete this.body;
    delete this.markdown;
    var data = JSON.stringify(this, null, 2) + ' //\n' + src;
    fs.writeFileSync(file, data);
  }    

}, {
  schema: {
    properties: {
      type: { type: 'string', default: 'post', required: true },
      title: { type: 'string', default: '', required: true },
      author: { type: 'string', default: '', required: true },
      tags: { type: Array, default: [] },
      markdown: {type: 'string'}
    }
  },

  read: function (file) {
    var data = fs.readFileSync(file).toString().split(' //\n')
      , post = JSON.parse(data[0]);

    post.markdown = data[1];
    post.body = md.parse(post.markdown);

    if (!post._id) {
      var slug = post.title;
      slug = slug.replace(/[^\w]+/g, '-');
      slug = slug.replace(/^-|-$/g, '');
      slug = slug.toLowerCase();
      post._id = slug;
    }

    return new this(post);
  }
});

module.exports.Post = Post;
