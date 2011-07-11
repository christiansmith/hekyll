var Doc = require('notch').Doc
  , md = require('discount')
  , fs = require('fs');

var Post = Doc.extend(null, {
  schema: {
    properties: {
      type: { type: 'string', default: 'post', required: true },
      title: { type: 'string', default: '', required: true },
      author: { type: 'string', default: '', required: true },
      tags: { type: 'array', default: [] },
      markdown: {type: 'string'}
    }
  },

  read: function (file) {
    var data = fs.readFileSync(file).toString().split(' //\n')
      , post = JSON.parse(data[0]);

    post.markdown = data[1];
    post.body = md.parse(post.markdown);
    return new this(post);
  }
});

module.exports.Post = Post;
