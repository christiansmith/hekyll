var Post = require('../apps/hekyll/lib/models').Post
  , fs = require('fs');

describe('Post', function() {
  it('should spawn a post', function() {
    var post = Post.spawn();
    expect(post.type).toEqual('post');
    expect(post.title).toBeDefined();
    expect(post.author).toBeDefined();
    expect(post.tags).toEqual([]);
  });
});  

describe('Post.read', function() {
  var post;

  beforeEach(function() {
    json = Post.spawn();
    data = JSON.stringify(json, null, 2) + ' //\n' + 'A bit of *markdown*';
    spyOn(fs, 'readFileSync').andReturn(new Buffer(data));
    post = Post.read('file.md');
  });
  
  it('should render markdown', function() {
    expect(post.body).toEqual('<p>A bit of <em>markdown</em></p>');
  });
});  
