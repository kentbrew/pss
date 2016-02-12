# Pinterest Slide Show

Slide shows on the Internet really suck. Here's the start of something that takes a Pinterest board URL and turns it into a grid of thumbnails.

### Try It

http://kentbrewster.com/pss/

* Click a thumb to see the close-up view.
* Click the nav arrows to move around.
* Click anything else in close-up to get back to grid view.

### Things to Do and Notice

* In grid mode we show the Pinterest board title and description.
* In close-up mode we're tinting the background modal layer with the dominant image color.
* Keyboard navigation works.  Arrows to move, Escape to return to grid.
* Try it on your favorite Pinterest board by pasting the full URL into the blank.

### Mobile?

It's reasonably useful on mobile Safari and Chrome in landscape.  Navigation arrows are bigger and photo description floats up and over so you can see it.  We're listening for touch events, running the right function, and preventing default behavior. This needs more work, especially when you pinch to zoom or change orientation.

### Still to Come

* Better error handling; right now it's an ugly JavaScript alert.
* Lots of mobile affordances, such as swipe to navigate and better portrait presentation.
* Some sort of loading progress indicator.
* Play multimedia pins and animated GIFs.
* Proper backlinks to Pinterest and the media source (for attributed media, such as Flickr).
* Better handling for long descriptions and titles.
* The ability to use a Pinterest profile URL or an arbitrary list of pin IDs, for better control of ordering.

### Tested On

* Firefox 44, Safari 9.0.3, Chrome 48, and IE11 (via Browserstack)
* Safari and Chrome (on an iPhone 6)
