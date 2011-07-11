var Doc = require('notch').Doc;

var Post = Doc.extend(null, {
  schema: {
    properties: {
      type: { type: 'string', default: 'post', required: true },
      title: { type: 'string', default: '', required: true },
      author: { type: 'string', default: '', required: true },
      tags: { type: 'array', default: [] },
      markdown: {type: 'string'}
    }
  }
});

module.exports.Post = Post;
