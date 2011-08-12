/**
 * Module dependencies
 */

var notch = require('notch')
  , models = require('./lib/models')
  , ddoc = notch.createDDoc('blog');


/**
 * File System Content
 */

ddoc.load('_attachments');
ddoc.load({ json: 'schemas' });
ddoc.load({ json: 'info.json' });
ddoc.load({ modules: 'lib' });
ddoc.load({ modules: 'vendor' });
ddoc.load({ modules: 'templates', locals: ddoc.info });

/**
 * Rewrites
 */

/**
 * Index shows all posts, reverse chronological
 */

ddoc.rewrite({
  from: '/',
  to: '_list/posts/dated',
  query: {
    descending: 'true',
    limit: (ddoc.info.pagesize + 1).toString()
  }
});

/**
 * All posts, reverse chronological. 
 */

ddoc.rewrite({
  from: '/posts',
  to: '_list/posts/dated',
  query: {
    descending: 'true',
    limit: (ddoc.info.pagesize + 1).toString()
  }
});

/**
 * Individual posts by id
 */

ddoc.rewrite({
  from: '/posts/:docid',
  to: '_show/doc/:docid'
});

/**
 * Posts by author
 */

ddoc.rewrite({
  from: '/authors/:author',
  to: '_list/posts/authors',
  query: {
    startkey: [':author', {}],
    endkey: [':author'],
    descending: 'true',
    limit: (ddoc.info.pagesize + 1).toString()
  }
});

/**
 * Posts by year, month or day
 */ 

ddoc.rewrite({
  from: '/posts/dated/:year',
  to: '_list/posts/dated',
  query: {
    startkey: [':year', {}],
    endkey: [':year'],
    descending: 'true',
    limit: (ddoc.info.pagesize + 1).toString()
  },
  formats: {
    year: 'int'
  }
});

ddoc.rewrite({
  from: '/posts/dated/:year/:month',
  to: '_list/posts/dated',
  query: {
    startkey: [':year', ':month', {}],
    endkey: [':year', ':month'],
    descending: 'true',
    limit: (ddoc.info.pagesize + 1).toString()
  },
  formats: {
    year: 'int',
    month: 'int'
  }
});

ddoc.rewrite({
  from: '/posts/dated/:year/:month/:day',
  to: '_list/posts/dated',
  query: {
    startkey: [':year',':month',':day', {}],
    endkey: [':year',':month',':day'],
    descending: 'true',
    limit: (ddoc.info.pagesize + 1).toString()
  },
  formats: {
    year: 'int',
    month: 'int',
    day: 'int'
  }
});

/**
 * Posts by tag, reverse chronological
 */

ddoc.rewrite({
  from: '/posts/tagged/:tag',
  to: '_list/posts/tagged',
  query: {
    startkey: [':tag', {}],
    endkey: [':tag'],
    descending: 'true',
    limit: (ddoc.info.pagesize + 1).toString()
  }
});

/**
 * Let everything else look for an attachment.
 */

ddoc.rewrite({
  from: '/*',
  to: '/*'
})

/**
 * Validate documents
 */

// let's automatically add these in via notch?
ddoc.schema('post', models.Post.schema);

ddoc.validation(function (newDoc, oldDoc, userCtx) {
  var validate = require('vendor/json-schema').validate
    , schema = this.schemas[newDoc.type];

  if (!userCtx.name) {
    throw { forbidden: 'Please log in first' };
  }

  if (oldDoc && newDoc.type !== oldDoc.type) {
    throw { forbidden: 'Can\'t change document type' };
  }

  if (schema) {
    var report = validate(newDoc, schema);
    if (!report.valid) {
      throw { forbidden: report };
    }
  }
});

/**
 * Views
 */

ddoc.view('authors', {
  map: function (doc) {
    if (doc.type == 'post' && doc.author) {
      var author = doc.author.replace(' ', '').toLowerCase()
        , key = [author, doc.published_at];
      emit(key, doc);
    }
  }
});

ddoc.view('dated', {
  map: function (doc) {
    if (doc.type == 'post' && doc.published_at) {
      emit(doc.published_at, doc);
    }
  }    
});

ddoc.view('tagged', {
  map: function (doc) {
    if (doc.type == 'post' && doc.tags) {
      doc.tags.forEach(function (tag) {
        emit([tag, doc.published_at], doc);
      });
    }
  } 
});


/**
 * Shows
 *
 * This function is generalized to any document. It will look up 
 * a template for the document and merge in helpers. We could further 
 * refine it by getting shared helpers and doc type specific 
 * helpers, e.g.,
 *
 * _.extend(doc, helpers.shared, helpers[doc.type]);
 *
 * This of course requires lib/helpers to be structured that way.
 *
 * Note also that showMustache must be an anon function assigned 
 * to a var rather than a function statement. We could potentially
 * move this and others like it into notch. Time will tell.
 */

var showMustache = function (doc, req) {
  var _ = require('vendor/underscore')
    , Mustache = require('vendor/mustache')
    , helpers = require('lib/helpers')
    , template = this.templates[doc.type]
    , partials = this.templates.partials;

  _.extend(doc, helpers);
  return Mustache.to_html(template, doc, partials);
}

ddoc.show('doc', showMustache);

/**
 * Lists
 */

ddoc.list('posts', function (head, req) {
  var _ = require('vendor/underscore')
    , Mustache = require('vendor/mustache')
    , Atom = require('vendor/atom')
    , helpers = require('lib/helpers')
    , template = this.templates.index
    , partials = this.templates.partials
    , relpath = req.requested_path.join('/')
    , abspath = 'http://' + req.headers.Host + '/' + relpath
    , ddoc = this
    , info = ddoc.info;

  provides('html', function () {
    var row, stash, results = [], next, prev;

    while (row = getRow()) {
      _.extend(row.value, helpers);
      results.push(row.value);
      next = row;
    }

    // Work towards paging. 
    if (results.length > info.pagesize) {
      results.pop();
    } else {
      next = undefined;
    }

    stash = {
      title: req.query.key || info.tagline,
      posts: results,
      atom_root: {
        title: info.blog,
        href: 'http://' + req.headers.Host + '/?format=atom'
      }
    };

    if (req.requested_path.length !== 0) {
      stash.list = req.requested_path[req.requested_path.length - 1];
      stash.atom_current = {
        title: stash.list,
        href: abspath + '?format=atom'
      };
    }

    return Mustache.to_html(template, stash, partials);
  });

  provides('atom', function () {
    // This is pretty much stolen from sofa. The main difference 
    // is cleaner urls, which are implemented in an unsophisticated way. 
    // There might potential for some standard url helpers in notch. They 
    // would probably need to be tied in with rewrites, rather than 
    // _list/_show, etc. 
    var row = getRow()
      , header = Atom.header({
          updated: (row ? helpers.toDate(row.value.published_at) : new Date()),
          title: info.blog,
          feed_id: relpath,
          feed_link: abspath
        });

    send(header);

    if (row) {
      do {
        var link = 'http://' + req.headers.Host 
                 + '/posts/' + row.value._id
          , entry = Atom.entry({
              entry_id: link, 
              title: row.value.title,
              content: row.value.summary || row.value.body,
              updated: helpers.toDate(row.value.updated_at),
              author: row.value.author,
              alternate: link
            });
        
        send(entry);
      } while (row = getRow());
    } 

    return '</feed>';
  });

});

module.exports = ddoc;
