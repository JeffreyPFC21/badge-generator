Badge Generator
===============

After being frustrated at the poor quality of badge generators on the internet - I made my own, with good old jQuery.

It's not pretty but it works pretty well.  It's also probably got a memory leak where it renders the SVG layers into the Canvas badge

I tried using SVG libraries but gave up ... they are all pretty poor and seemed more hastle than they were worth

Usage
-----

Try it here: http://www.mountainstorm.co.uk/test/badge-generator/badge-generator.html

There aren't many shapes there due to licensing; I strongly suggest you go to http://www.shapes4FREE.com as they have loads but I can't distribute them here due to licensing :(

Alternativly:   
    1. stuff it on your own server
    2. Collect a load of small SVG images (they need viewBox set)
    3. run 'shapes.py' to create a json file listing them all
    4. enjoy

License
-------
Copyright (c) 2015 Mountainstorm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.