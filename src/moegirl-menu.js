$(function () {
  var moegirl_menu = $('<nav id="moegirl-menu" />');
  moegirl_menu.on('touchstart', function (event) {
    if (!$(event.target).closest('#moegirl-menu-list').length) return false;
  });
  $('body').append(moegirl_menu);

  moegirl_menu.append('<div id="moegirl-menu-title">' + $('h1').text() + '</div>');

  var moegirl_menu_list = $('<ol id="moegirl-menu-list" />');
  var menu_index = 0;
  $('h2, h3, h4, h5').each(function () {
    var heading_el = $(this);
    
    moegirl_menu_list.append(
      $('<li />')
        .text(heading_el.text())
        .addClass('moegirl-menu-' + this.tagName.toLowerCase())
        .data('bind-element', heading_el)
    );
  });
  moegirl_menu_list.on('click', 'li', function () {
    $('html, body').scrollTop($(this).data('bind-element').offset().top);
    $('body').toggleClass('moegirl-menu-show');
  }).on('touchstart', function () {
    var scrollTop = $(this).scrollTop();
    var scrollTopMax = this.scrollHeight - $(this).innerHeight();
    
    if (0 >= scrollTop) {
      $(this).scrollTop(1);
    } else if (scrollTopMax <= scrollTop) {
      $(this).scrollTop(scrollTopMax - 1);
    }
  }).appendTo(moegirl_menu);

  var moegirl_menu_button = $('<div id="moegirl-menu-mind-attack" />');
  moegirl_menu_button.on('touchstart', function (event) {
    event.stopPropagation();
    
    $('body').toggleClass('moegirl-menu-show');
  });
  $('body').append(moegirl_menu_button);

  $('body').on('touchstart', function () {
    moegirl_menu_button.addClass('pause');
    
    $(this).one('touchend', function () {
      moegirl_menu_button.removeClass('pause');
    });
  });

  // fix bubbling (http://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html)
  $('.mw-body').on('touchstart', function () { });

  var moegirl_menu_mask = $('<div id="moegirl-menu-mask" />');
  moegirl_menu_mask.on('touchstart', function (event) {
    return false;
  });
  $('body').append(moegirl_menu_mask);
});