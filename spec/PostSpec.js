var Post = require('../apps/hekyll/lib/models').Post;

describe('Post', function() {
  it('should spawn a post', function() {
    var post = Post.spawn();
    expect(post.type).toEqual('post');
    expect(post.title).toBeDefined();
    expect(post.author).toBeDefined();
    expect(post.tags).toEqual([]);
  });
});  

