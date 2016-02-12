// Pinterest board to slide show

(function (w, d, a) {
  var $ = w[a.k] = {
    'a': a,
    'd': d,
    'w': w,
    's': {},
    'v': {},
    'f': (function () {
      return {
        // an empty array of callbacks to be populated by API calls later
        callback: [],
        // add event listeners in a cross-browser fashion
        listen : function (el, ev, fn) {
          if (typeof $.w.addEventListener !== 'undefined') {
            el.addEventListener(ev, fn, false);
          } else if (typeof $.w.attachEvent !== 'undefined') {
            el.attachEvent('on' + ev, fn);
          }
        },
        // get a DOM property or text attribute
        get: function (el, att) {
          var v = null;
          if (typeof el[att] === 'string') {
            v = el[att];
          } else {
            v = el.getAttribute(att);
          }
          return v;
        },
        // set a DOM property or text attribute
        set: function (el, att, string) {
          if (typeof el[att] === 'string') {
            el[att] = string;
          } else {
            el.setAttribute(att, string);
          }
        },
        // create a DOM element
        make: function (obj) {
          var el = false, tag, att;
          for (tag in obj) {
            if (obj[tag].hasOwnProperty) {
              el = $.d.createElement(tag);
              for (att in obj[tag]) {
                if (obj[tag][att].hasOwnProperty) {
                  if (typeof obj[tag][att] === 'string') {
                    $.f.set(el, att, obj[tag][att]);
                  }
                }
              }
              break;
            }
          }
          return el;
        },
        // find an event's target element
        getEl: function (e) {
          var el = null;
          if (e.target) {
            // this works all the way down to IE5.2 on Mac OS9
            el = (e.target.nodeType === 3) ? e.target.parentNode : e.target;
          } else {
            el = e.srcElement;
          }
          return el;
        },
        // remove a DOM element
        kill: function (obj) {
          if (typeof obj === 'string') {
            obj = $.d.getElementById(obj);
          }
          if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
          }
        },
        // talk to an outside API
        call: function (url, func) {
          var id, sep = '?', n = $.f.callback.length;
          // id will help us remove the SCRIPT tag later
          id = $.a.k + '.f.callback[' + n + ']';
          // create the callback
          $.f.callback[n] = function (r) {
            // run the function 
            func(r, n);
            $.f.kill(id);
          };
          // some calls may come with a query string already set
          if (url.match(/\?/)) {
            sep = '&';
          }
          // make and call the new script node
          $.d.b.appendChild($.f.make({'SCRIPT': {'id': id, 'type': 'text/javascript', 'charset': 'utf-8', 'src': url + sep + 'callback=' + id}}));
        },
        ping: function (r) {

          // janky error handling
          if (!r.data || !r.data.pins) {
            alert('Whoops, no pins found. Please try another board.');
            $.s.board.focus();
            return;
          }
          
          // uncomment to reverse order of thumbs
          /*
          r.data.pins.sort(function (a, b) {
            if (a.id > b.id) {
              return 1;
            } else {
              return -1;
            }
          });
          */
          
          $.s.name.innerHTML = r.data.board.name;
          $.s.description.innerHTML = r.data.board.description;
          $.s.rack.innerHTML = '';

          for (var i = 0; i < r.data.pins.length; i = i + 1) {
            // fill a 7x7 grid
            if (i === 49) { 
              break;
            }
            var pin = r.data.pins[i];
            // 
            var url = pin.images['237x'].url.replace(/237x/, '600x');
            var height = pin.images['237x'].height;
            var width = pin.images['237x'].width;
            var thumb = $.f.make({'A': {
              'id': '_' + i,
              'className': 'thumb',
              'title': pin.description,
              'data-color': pin.dominant_color,
              'data-height': '' + (height * 2.54),
              'data-width': '' + (width * 2.54),
              'data-image': 'url(' + url + ')'
            }});
            thumb.style.backgroundImage = 'url(' + pin.images['237x'].url + ')';
            $.s.rack.appendChild(thumb);
          }
          $.v.max = i - 1;
        },
        // enter closeup
        show: function (el) {
          $.s.display.className = '';
          $.s.slug.innerHTML = $.f.get(el, 'title').substr(0, 200);
          $.s.tint.style.backgroundColor = $.f.get(el, 'data-color');
          $.s.closeup.style.backgroundImage = $.f.get(el, 'data-image');
          $.v.current = el.id.split('_')[1] - 0;
          $.v.hazCloseup = true;
        },
        // exit closeup
        hide: function () {
          $.s.display.className = 'hidden';
          $.v.hazCloseup = false;
        },
        // show the next image 
        forward: function () {
          $.v.current = $.v.current + 1;
          if ($.v.current > $.v.max) {
            $.v.current = 0;
          }
          $.f.show($.d.getElementById('_' + $.v.current));
        },
        // show the previous image
        back: function () {
          $.v.current = $.v.current - 1;
          if ($.v.current < 0) {
            $.v.current = $.v.max;
          }
          $.f.show($.d.getElementById('_' + $.v.current));
        },
        // a click or touch has registered
        click: function (v) {
          var t, el, p, media;
          t = v || $.w.event;
          el = $.f.getEl(t);

          // enter closeup
          if (el.className === 'thumb') {
            $.f.show(el);
          }

          // exit closeup
          if (el === $.s.tint || el === $.s.closeup) {
            $.f.hide();
          }

          // navigate forward
          if (el === $.s.forward) {
            $.f.forward();
          }

          // navigate backwards
          if (el === $.s.back) {
            $.f.back();
          }
        },
        
        // if we're mobile, use this instead of click
        touch: function (v) {
          // make a copy of the event so we can run the same click function
          var t = v;
          
          // click it
          $.f.click(t);

          // don't do anything else
          v.preventDefault();
        },

        // you will have to pry my keyboard from my cold, dead fingers
        keydown: function (v) {

          var k, t = v || $.w.event;
          
          // keycodes for escape, right, and left
          var nav = {
            '_27': function () {
              $.f.hide();
            },
            '_37': function () {
              $.f.forward();
            },
            '_39': function () {
              $.f.back();
            }
          }
          
          // only navigate if we're in close-up mode
          if ($.v.hazCloseup) {
            if (t.keyCode) {
              k = '_' + t.keyCode;
              if (typeof nav[k] === 'function') {
                nav[k]();
              }
            }
          }
        },
        
        // try to load
        load: function () {
          // input massage
          var parts = $.s.board.value.split('/')
          var board = parts[3] + '/' + parts[4]; 
          
          // hit the API
          $.f.call($.a.endpoint + board + '/pins/', $.f.ping);
        },
        
        // get this party started
        init: function () {
          
          // grab pointers to all structural elements we're going to change
          for (var i = 0, n = $.a.el.length; i < n; i = i + 1) {
            $.s[$.a.el[i]] = $.d.getElementById($.a.el[i]);
          }
          
          // pointer to document.body
          $.d.b = $.d.getElementsByTagName('BODY')[0];

          if (typeof $.w.ontouchstart === 'object') { 
            // we're mobile; listen for touches
            $.f.listen($.d.b, 'touchstart', $.f.touch);
          } else {
            // we're desktop; listen for keys and clicks
            $.f.listen($.d.b, 'keydown', $.f.keydown);
            $.f.listen($.d.b, 'click', $.f.click);
          }
          
          // always listen for the board value to change
          $.f.listen($.s.board, 'change', $.f.load);
          
          // load our default
          $.f.load();
        }
      };
    }())
  };
  $.f.init();
}(window, document, {
  'k': 'P',
  'el': [
    'main', 
    'rack', 
    'name', 
    'description', 
    'glass', 
    'tint', 
    'closeup', 
    'slug', 
    'display', 
    'forward', 
    'back', 
    'board'
  ],
  'endpoint': 'https://widgets.pinterest.com/v3/pidgets/boards/'
}));
