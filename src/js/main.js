"use strict";

// Checks for the ability to detect the end of a CSS transition
// http://jsfiddle.net/sebastienp/P6M3X/
var test_tend = (function(WINDOW) { // Munge "window"

  var prefixes = [
      "", // Firefox
      "webkit", // Webkit-based
      "o" // Opera
    ],
    i = -1,
    l = prefixes.length,
    ret = false,
    vendor;

  while ((i += 1) < l) {

    vendor = prefixes[i];

    if (("on" + vendor + "transitionend") in WINDOW) {

      ret = new WINDOW.Boolean(true);
      ret.event = ((vendor) ? vendor + "T" : "t") + "ransitionEnd";

      break;

    }

  }

  return ret;

}(this));

//open menu
$('.menu-trigger')
  .on('click', function(event) {
    event.preventDefault();
    $('html,body')
      .animate({
        scrollTop: 0
      }, 300);
    $('.main-content')
      .addClass('move-out');
    $('.nav')
      .addClass('is-visible');
    $('.shadow-layer')
      .addClass('is-visible');
  });
//close menu
$('.close')
  .on('click', function(event) {
    event.preventDefault();
    $('.main-content')
      .removeClass('move-out');
    $('.main-nav')
      .removeClass('is-visible');
    $('.shadow-layer')
      .removeClass('is-visible');
  });
//scroll to menu item content
$('.nav a')
  .on('click', function(event) {
    event.preventDefault();
    $('.main-content')
      .removeClass('move-out');
    $('.nav')
      .removeClass('is-visible');
    $('.shadow-layer')
      .removeClass('is-visible');
    var l = $(this)
      .attr('href');
    if (test_tend) {
      // Create a callback function based on the end of the transition
      $('.main-content')
        .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
          function(e) {
            var d = 400;
            d = $(l)
              .css('height');
            $('html,body')
              .animate({
                scrollTop: $(l)
                  .offset()
                  .top
              }, 300);
          });
    }

  });

//clipped image - blur effect

function set_clip_property() {
var $header_height = $('.header')
  .height(),
  $window_height = $(window)
  .height(),
  $header_top = $window_height - $header_height,
  $window_width = $(window)
  .width();
$('.blurred-bg')
  .css('clip', 'rect(' + $header_top + 'px, ' + $window_width + 'px, ' + $window_height + 'px, 0px)');
}
set_clip_property();
// calc_height();
$(window)
  .on('resize', function() {
    set_clip_property();
    // calc_height();
  });

function calc_height() {
  var $content_height = $('#intro').height();
  if (window.console) console.log($content_height);
  $('.panel-2').css('margin-top', $content_height + 'px');
}


// Image gallery stuff
function gallery() {

  var Gallery = {

    init: function(config) {
      this.trigger = config.trigger;
      this.hook = config.hook;
      this.gallery = config.gallery;
      this.galleryInner = config.galleryInner;
      this.next = config.next;
      this.prev = config.prev;
      this.close = config.close;
      this.dirClass = config.dirClass;
      this.gotoClose = config.gotoClose;
      this.current = 0;
      this.gEvents();
    },

    getProject: function(src) {

      // Prepare query string and send AJAX request
      $.ajax({
        context: this,
        url: 'projects/' + src + '.html',
        success: function(data, msg) {
          if (msg.substr(0, 5) !== 'Error') {
            this.hook.append(data);
            $(this.gallery).removeClass('gone');
            this.hook.removeClass('gone');
            $('body').addClass('project-showing');
          }
        }
      });

    },

    // getImage: function(img) {
    //
    //   // Get rid of current for existing images
    //   $(this.galleryInner).find('li').removeClass('current slide-first slide-second');
    //
    //   // Look for existence of image in the gallery already
    //   var imgSelector = '#' + img.slice(0, -4),
    //     _this = this,
    //     insert = 0;
    //
    //   if (window.console) console.log(imgSelector + ' <<< imgSelector');
    //
    //   // If the image doesn't exist yet create a list item and append in the right position
    //   // If it already exists just switch classes
    //   if (!$(imgSelector).length) {
    //     var li = $('<li>', {
    //       html: $(new Image()).attr('src', 'img/art/' + img),
    //       id: img.slice(0, -4),
    //       'data-order': this.current
    //     });
    //
    //     $(this.galleryInner).find('li').each(function(i) {
    //
    //       if (parseInt($(this).data('order')) > _this.current) {
    //         insert = i + 1;
    //         li.insertBefore($(this));
    //         return false;
    //       }
    //     });
    //     if (parseInt(insert) === 0) {
    //       $(this.galleryInner).append(li);
    //     }
    //
    //   }
    //   $(imgSelector).addClass('current ' + this.dirClass);
    //
    //   this.checkControls();
    //
    // },

    checkControls: function() {

      // Check if the Prev control is needed
      if (window.console) console.log(this.current + ' <<<< current');
      if (this.current === 1) {
        $(this.prev).addClass('gone');
      } else {
        $(this.prev).removeClass('gone');
      }

      // Check if the Next control is needed
      if (this.current === 24) {
        $(this.next).addClass('gone');
      } else {
        $(this.next).removeClass('gone');
      }

      // Choose which heading to display
      // $('h1.ian, h1.squid').addClass('gone');
      // if (parseInt(this.current) > 12) {
      //   $('h1.ian').removeClass('gone');
      // } else {
      //   $('h1.squid').removeClass('gone');
      // }

    },

    gEvents: function() {

      var _this = this;

      // Open the gallery

      $('body').on('click', _this.trigger, function(event) {
        event.preventDefault();
        _this.current = $(this).data('order');

        var src = $(this).data('src');

        // go get the project snippet if it doesn't already exist
        if (!$('#' + src).length) {
          _this.getProject(src);
        } else {
          $(_this.gallery).addClass('gone');
          $('#' + src).removeClass('gone');
          $(_this.hook).removeClass('gone');
          $('body').addClass('project-showing');
          // _this.getImage(src);
          _this.checkControls();
        }

      });

      // Close the gallery

      $('body').on('click', _this.close, function(event) {
        event.preventDefault();

        // Move the Artists section back to top on closing the gallery
        $('body').removeClass('project-showing');
        $('html, body').animate({
          scrollTop: $(_this.gotoClose).offset().top
        }, 0);

        $(_this.hook).addClass('gone');

      });

      // Previous image

      $('body').on('click', _this.prev, function(event) {
        event.preventDefault();
        _this.current -= 1;
        _this.dirClass = 'slide-first';
        $(_this.trigger).each(function(i) {
          if (parseInt($(this).data('image-order')) === _this.current) {
            _this.getImage($(this).data('image-gallery'));
          }
        });
      });

      // Next image

      $('body').on('click', _this.next, function(event) {
        event.preventDefault();
        _this.current += 1;
        _this.dirClass = 'slide-second';
        $(_this.trigger).each(function(i) {
          if (parseInt($(this).data('image-order')) === _this.current) {
            _this.getImage($(this).data('image-gallery'));
          }
        });

      });

      $(document).keyup(function(e) {

        if (e.keyCode == 27) {

          $(_this.gallery).addClass('gone');

          // Move the Artists section back to top on closing the gallery
          $('html, body').animate({
            scrollTop: $(_this.gotoClose).offset().top
          }, 0);
        } // escape key maps to keycode `27`
      });

    }

  };

  Gallery.init({
    trigger: '.panel--work .grid a',
    gallery: '.m__project',
    hook: $('.projects'),
    galleryInner: '.mod-gallery-inner ul',
    next: '.m__project--next',
    prev: '.m__project--prev',
    close: '.m__project--close',
    dirClass: 'slide-second',
    gotoClose: '#work',
  });

}
gallery();
