var Post = require('../lib/models').Post
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

describe('Post read from file', function() {
  var post;

  beforeEach(function() {
    json = Post.spawn();
    json.title = 'The Title of The Post';
    data = JSON.stringify(json, null, 2) + ' //\n' + 'A bit of *markdown*';
    spyOn(fs, 'readFileSync').andReturn(new Buffer(data));
    post = Post.read('file.md');
  });

  it('should have a markdown property',function () {
    expect(post.markdown).toBeDefined();
  });
  
  it('should render markdown', function() {
    expect(post.body).toEqual('<p>A bit of <em>markdown</em></p>');
  });

  it('should define _id from title if undefined', function() {
    expect(post._id).toEqual('the-title-of-the-post');
  });
});  

describe('write', function() {
  beforeEach(function() {
    post = new Post({ 
      markdown: 'whatever', 
      body: '<p>whatever</p>' 
    });    
    spyOn(fs, 'writeFileSync');
    
    post.write('file.md');
    // need a post that has been written
    data = fs.writeFileSync.mostRecentCall.args[1];
  });

  it('should remove body', function () {
    expect(data).not.toContain('"body":');
  });

  it('should move markdown out of json', function () {
    expect(post.markdown).not.toBeDefined();
  });
  
});  

