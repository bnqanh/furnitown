/** 
  *	Edited by Anh 11/18/2023
  * base on :
  * Load More Results v1.0.0
  * Author: Cenk Çalgan
  * 
  * Options:
  * - tag (object):
  *		- name (string)
  *		- class (string)
  * - displayedItems (int)
  *	- showItems (int)
  * - button (object):
  *		- class (string)
*/
(function ($) {
  'use strict';

  $.fn.loadMoreResults = function (options) {

    var defaults = {
      tag: {
        name: 'div',
        'class': 'item'
      },
      displayedItems: 5,
      showItems: 5,
      button: {
        'class': 'load_more',
      }
    };

    var opts = $.extend(true, {}, defaults, options);

    var alphaNumRE = /^[A-Za-z][-_A-Za-z0-9]+$/;
    var numRE = /^[0-9]+$/;

    $.each(opts, function validateOptions(key, val) {
      if (key === 'tag') {
        formatCheck(key, val, 'name', 'string');
        formatCheck(key, val, 'class', 'string');
      }
      if (key === 'displayedItems') {
        formatCheck(key, val, null, 'number');
      }
      if (key === 'showItems') {
        formatCheck(key, val, null, 'number');
      }
      if (key === 'button') {
        formatCheck(key, val, 'class', 'string');
      }
    });

    function formatCheck(key, val, prop, typ) {
      if (prop !== null && typeof prop !== 'object') {
        if (typeof val[prop] !== typ || String(val[prop]).match(typ == 'string' ? alphaNumRE : numRE) === null) {
          opts[key][prop] = defaults[key][prop];
        }
      } else {
        if (typeof val !== typ || String(val).match(typ == 'string' ? alphaNumRE : numRE) === null) {
          opts[key] = defaults[key];
        }
      }
    };

    return this.each(function (index, element) {
      var $list = $(element),
        lc = $list.find(' > ' + opts.tag.name + '.' + opts.tag.class).length,
        dc = parseInt(opts.displayedItems),
        sc = parseInt(opts.showItems);

      $list.find(' > ' + opts.tag.name + '.' + opts.tag.class + ':lt(' + dc + ')').css("display", "inline-block");
      $list.find(' > ' + opts.tag.name + '.' + opts.tag.class + ':gt(' + (dc - 1) + ')').css("display", "none");
      $list.parent().on("click", "." + opts.button.class, function (e) {
        e.preventDefault();
        dc = (dc + sc <= lc) ? dc + sc : lc;

        $list.find(' > ' + opts.tag.name + '.' + opts.tag.class + ':lt(' + dc + ')').fadeIn();
        if (dc == lc) {
          $(this).hide();
        }
      });
    });

  };
})(jQuery);

(function ($) {
  'use strict';

  $.fn.pagination = function (options) {

    var defaults = {
      menuSize: 4,
      showItems: 6,
      menuClass: "pagination-menu"
    };

    var opts = $.extend(true, {}, defaults, options);

    var alphaNumRE = /^[A-Za-z][-_A-Za-z0-9]+$/;
    var numRE = /^[0-9]+$/;

    $.each(opts, function validateOptions(key, val) {

      if (key === 'menuSize') {
        formatCheck(key, val, 'number');
      }
      if (key === 'showItems') {
        formatCheck(key, val, 'number');
      }
      if (key === 'menuClass') {
        formatCheck(key, val, 'string');
      }
    });

    function formatCheck(key, val, typ) {
      if (typeof val !== typ || String(val).match(typ == 'string' ? alphaNumRE : numRE) === null) {
        opts[key] = defaults[key];
      }
    };
    // set array
    function range(start, end) {
      return Array.from(Array(end - start + 1), (_, i) => i + start);
    }
    // set page list
    function getPageList(totalPages, page, maxLength) {
      if (totalPages <= maxLength) {
        return range(1, totalPages);
      }
      if (page > totalPages - maxLength) {
        return range(totalPages - maxLength + 1, totalPages);
      }
      if (page % maxLength == 0) {
        return range(page - maxLength + 1, page);
      }
      return range(Math.floor(page / maxLength) * maxLength + 1, Math.ceil(page / maxLength) * maxLength);
    }


    return this.each(function (index, element) {
      var $content = $(element),
        limitPerPage = parseInt(opts.showItems),
        paginationSize = parseInt(opts.menuSize),
        numberOfItems = $content.children().length,
        totalPages = Math.ceil(numberOfItems / limitPerPage),
        currentPage;
      $content.after($("<ul>").addClass(opts.menuClass))
      var $menu = $content.parent().find('.' + opts.menuClass);
      //show page 
      function showPage(whichPage) {
        currentPage = whichPage;
        if (whichPage < 1 || whichPage > totalPages) return false;

        $content.children().hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $menu.children("li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
          $("<li>").addClass("current-page").toggleClass("active", item === currentPage).append($("<a>").attr({ href: "javascript:void(0)" }).text(item)).insertBefore(".next-page");
        });
        $menu.find(".previous-page").toggleClass("disable", currentPage === 1);
        $menu.find(".next-page").toggleClass("disable", currentPage === totalPages);
        return true;
      }
      $menu.append(
        $("<li>").addClass("previous-page").
          append($("<a>").attr({ href: "javascript:void(0)" })),
        $("<li>").addClass("next-page").
          append($("<a>").attr({ href: "javascript:void(0)" })),
      );

      $content.show();
      showPage(1);

      $menu.on("click", "li", function () {
        $('html, body').animate({
          scrollTop: $content.offset().top - 180
        }, 0);
      });

      $menu.on("click", ".current-page:not(.active)", function () {
        return showPage(+$(this).text());
      });

      $menu.on("click", ".next-page", function () {
        return showPage(currentPage + 1);
      });

      $menu.on("click", ".previous-page", function () {
        return showPage(currentPage - 1);
      });
    });

  };
})(jQuery);
// main js
$(document).ready(function () {
  // show side menu
  $('#header-btn').click(() => {
    $('#header-menu').addClass("--active");
    $('.overlay').addClass('active');
  });

  $('#mobi-btn').click(() => {
    $('#header-menu').toggleClass("--active");
    $('.overlay').toggleClass('active');
    $('#mobi-btn').toggleClass('close');
  });
  // close side menu
  $('#menu-close').click(() => {
    $('#header-menu').removeClass("--active");
    $('.overlay').removeClass('active');
  });
  $('.overlay').click(() => {
    $('#header-menu').removeClass("--active");
    $('.overlay').removeClass('active');
  })
  // show scroll menu
  $(window).scroll(() => {
    var header = $('#header');
    const mediaQuery = matchMedia("(min-width: 61.999em)").matches;
    if (header && mediaQuery) {
      if (pageYOffset > 70) {
        header.addClass('--scroll')
        $('#header-menu').removeClass("--active")
        $('.overlay').removeClass('active')
      }
      else
        header.removeClass('--scroll')

    }

  })
  // scroll up
  $(window).scroll(() => {
    var scrollTop = $('#scroll-top')
    if (scrollTop)
      pageYOffset > window.innerHeight ? scrollTop.addClass('show') : scrollTop.removeClass('show')
  })
  //carousel function
  // external js: flickity.pkgd.js
  function carousel_play(id, carousel) {

    // Flickity instance
    var flkty = carousel.data('flickity');
    // elements
    var $cellButtonGroup = id.siblings('.carousel-buttons');
    var $cellButtons = $cellButtonGroup.find('.carousel-buttons__dot');
    var $cellLabels = $cellButtonGroup.find('.carousel-buttons__number');
    var $nextButton = $cellButtonGroup.find('.carousel-buttons__next');
    var $prevButton = $cellButtonGroup.find('.carousel-buttons__prev');
    var $zoomButton = $cellButtonGroup.find('.carousel-buttons__zoom');
    $prevButton.addClass('invisible')
    // update selected cellButtons
    carousel.on('select.flickity', function () {
      $cellButtons.filter('.is-selected')
        .removeClass('is-selected');
      $cellButtons.eq(flkty.selectedIndex)
        .addClass('is-selected');
      $cellLabels.filter('.is-selected')
        .removeClass('is-selected');
      $cellLabels.eq(flkty.selectedIndex)
        .addClass('is-selected');

      if (flkty.selectedIndex >= flkty.cells.length - 1) {
        $nextButton.addClass('invisible')
        $prevButton.removeClass('invisible')
      }
      else if (flkty.selectedIndex <= 0) {
        $prevButton.addClass('invisible')
        $nextButton.removeClass('invisible')
      } else {
        $nextButton.removeClass('invisible')
        $prevButton.removeClass('invisible')
      }
    });
    // select cell on button click
    $cellButtonGroup.on('click', '.carousel-buttons__dot', function () {
      var index = $(this).index();
      carousel.flickity('select', index);
    });
    // previous
    $prevButton.on('click', function () {
      carousel.flickity('previous');
    });
    // next
    $nextButton.on('click', function () {
      carousel.flickity('next');
    });

  }
  //carousel home page
  var $id_homepage_carousel = $("#homepage_carousel")
  var $carousel_homepage = $id_homepage_carousel.flickity({
    autoPlay: true,
    selectedAttraction: 0.0025,
    friction: 0.08,
    prevNextButtons: false,
    pageDots: false,
  });
  carousel_play($id_homepage_carousel, $carousel_homepage);

  //carousel product page
  $('.product__line-carousel').each(function () {
    // external js: flickity.pkgd.js
    var $carousel_product = $(this).flickity({
      contain: true,
      prevNextButtons: false,
      pageDots: false,
    });
    carousel_play($(this), $carousel_product);
  })

  //carousel product details page
  var $details__images_carousel = $(".details__images-carousel"),
    $carousel_product_details_page = $details__images_carousel.flickity({
      contain: true,
      prevNextButtons: false,
      pageDots: false,
    });
  carousel_play($details__images_carousel, $carousel_product_details_page);

  //carousel product details page
  var $details__project_carousel = $(".details__project-carousel"),
    $carousel_project_details_page = $details__project_carousel.flickity({
      contain: true,
      prevNextButtons: false,
      pageDots: false,
    });
  carousel_play($details__project_carousel, $carousel_project_details_page);
  //load more product in product_category
  function load_more_responsive(element, btn_class) {
    var $list = $(element)
    if (matchMedia("(min-width: 62em)").matches) {
      $('.product__line-wrapper').loadMoreResults(
        {
          displayedItems: 9,
          showItems: 6,
          button: {
            'class': btn_class,
          }
        }
      );
    }
    else {
      $('.product__line-wrapper').loadMoreResults(
        {
          displayedItems: 6,
          showItems: 6,
          button: {
            'class': btn_class,
          }
        }
      );
    }
  }
  load_more_responsive('.product__line-wrapper', 'load_more');

  // zoom product detail
  $('#zoom-image').on('click', function () {
    Fancybox.fromNodes($('[data-fancybox="details__images-gallery"]'));
  })

  // select box
  $('.select').each(function () {
    let $select = $(this),
      $select__btn = $(this).children('.select__btn'),
      $select__options = $(this).children('.select__options'),

      $select__options__mobi = $select__options.clone().addClass("mobi").appendTo("header")

    $select__btn.click(() => {
      $select.siblings('.active').removeClass('active')
      $select.toggleClass('active')
      $select__options__mobi.toggleClass('show')
    })

    $select.find('.select__options-item').each(function () {
      let $option = $(this),
        $select__span = $select__btn.children('span'),
        $option__span = $(this).children('span')
      $option.click(() => {
        $select__span.text($option__span.text())
        $select.removeClass('active')
      })
    })
    $select__options__mobi.find('.select__options-item').each(function () {
      let $option = $(this),
        $select__span = $select__btn.children('span'),
        $option__span = $(this).children('span')
      $option.click(() => {
        $select__span.text($option__span.text())
        $select.removeClass('active')
        $select__options__mobi.removeClass('show')
      })
    })

  })
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".select").length) {
      $(".select.active").removeClass('active');
    }
  });
});

//others news carousel
$('.others__news-carousel').each(function () {
  // external js: flickity.pkgd.js
  var $carousel_news = $(this).flickity({
    autoPlay: true,
    selectedAttraction: 0.0025,
    friction: 0.08,
    contain: true,
    prevNextButtons: false,
    pageDots: false,
  });
  carousel_play($(this), $carousel_news);
})

