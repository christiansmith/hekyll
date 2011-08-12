# Hekyll

Hekyll is a CouchApp blog inspired by jekyll and built with [Notch](notch). It runs my blog at [anvil.io](http://anvil.io). There's no web administration. It's all done with text editing and notch commands. 

## Install

First you need a CouchDB instance, Node.js, npm, and [notch](https://github.com/christiansmith/notch) installed. Then clone hekyll from github:

    $ git clone git://github.com/christiansmith/hekyll.git
    $ cd hekyll
    $ npm install notch dateformat discount

## Usage

Edit config.json to point to your database. Then hack to your hearts content.

    $ notch push


Draft a new post:

    $ notch draft on-the-perils-of-drinking.json

You'll be prompted to take default values, or walk through the post schema. This command generates a file. Edit the generated file, writing your markdown underneath the last line of JSON.

Publish your post:

    $ notch publish data/development/post/on-the-perils-of-drinking.json


## Credit and Acknowledgements

I learned a lot from sofa, and adapted sofa's atom code for hekyll's feeds. Thanks to jchris and mojombo for the inspiration.

## License

Copyright (c) 2011 Christian Smith &lt;smith@anvil.io&gt; 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE.
