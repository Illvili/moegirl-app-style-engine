$(function () {
  var custome_style_regex = /^\s*(background|color|font)/i;
  function navbox_filter_style(el) {
    var style = $(el).attr('style');
    if (!style) return;
    
    var custome_styles = [];
    style = style.split(';');
    $.each(style, function () {
      if (!this.length) return;
      
      if (custome_style_regex.test(this)) {
        custome_styles.push(this);
      }
    });
    
    return custome_styles.join(';');
  }

  function navbox_subgroup_data(subgroup) {
    subgroup = $(subgroup);
    
    var DATA = {
      collapsible: false,
      open: true
    };
    
    if (subgroup.is('table')) {
      DATA['collapsible'] = subgroup.is('.mw-collapsible');
      DATA['open'] = subgroup.is('.autocollapse') || subgroup.is('.mw-uncollapsed');
      
      // check has navbox-title
      var el = subgroup.find('>tbody>tr>.navbox-title');
      if (el.length) {
        // if (el.find('>.mw-collapsible-toggle').length) {
          // headline
          var headline_el = el.find('>span:not(.mw-collapsible-toggle)');
          
          var navbox_title_el = headline_el.children();
          if (navbox_title_el.find('small').length) {
            // small nav like <-2013  xxx  2015->
            var elements = navbox_title_el.html().split('<br>');
            DATA['title'] = elements[0];
            DATA['nav'] = $(elements[1]).find('small').html();
          } else if (navbox_title_el.is('div') && 'text-align:center; line-height:10pt' == navbox_title_el.attr('style')) {
            // clear line-height of '日本2014年冬季动画' in http://zh.moegirl.org/Template:%E6%97%A5%E6%9C%AC2014%E5%B9%B4%E5%8A%A8%E7%94%BB
            
            DATA['title'] = navbox_title_el.html();
          // } else {
          //  DATA['title'] = headline_el.html();
          // }
        } else {
          DATA['title'] = el.html();
        }
      } // /check has navbox-title
      
      // get all subgroup
      var subgroup_data = [];
      subgroup.find('>tbody>tr').filter(function () {
        return !$(this).find('>.navbox-title').length && '2px' != $(this).css('height');
      }).each(function () {
        subgroup_data.push(navbox_subgroup_data(this));
      });
      DATA['subgroup'] = subgroup_data;
    } else if (subgroup.is('tr')) {
      // check has navbox-group
      var el = subgroup.find('>.navbox-group');
      if (el.length) {
        var style = navbox_filter_style(el);
        if (!!style) {
          DATA['titleStyle'] = style;
        }
        
        var navbox_group_el = el.children();
        if (navbox_group_el.is('div') && 'padding:0em 0.75em;' == navbox_group_el.attr('style')) {
          DATA['title'] = navbox_group_el.html();
        } else {
          DATA['title'] = el.html();
        }
      } // /check has navbox-group
      
      // check has navbox-list
      var el = subgroup.find('>.navbox-list');
      if (el.length) {
        if (el.find('>.navbox-subgroup').length) {
          var child_data = navbox_subgroup_data(el.find('>.navbox-subgroup'));
          if (!!child_data.title) {
            DATA['subgroup'] = [child_data];
          } else {
            DATA['subgroup'] = child_data.subgroup;
          }
        } else {
          var style = navbox_filter_style(el);
          if (!!style) {
            DATA['contentStyle'] = style;
          }
          
          DATA['content'] = el.html();
        }
      } // /check has navbox-list
      
      // .navbox-abovebelow treat as title
      var el = subgroup.find('>.navbox-abovebelow');
      if (el.length) {
        DATA['title'] = el.html();
      }
    }
    
    return DATA;
  }

  function navbox_data(navbox) {
    navbox = $(navbox);
    
    var NAVBOX_DATA = {
      subgroup: navbox_subgroup_data(navbox.find('>tbody>tr>td>.mw-collapsible'))
    };
    
    return NAVBOX_DATA;
  }

  var class_prefix = 'moegirl-flatten-navbox-';
  function navbox_subgroup_build(parent, subgroup_data) {
    if (!!subgroup_data.collapsible) {
      parent.addClass(class_prefix + 'collapsible');
      if (subgroup_data.open) parent.addClass(class_prefix + 'open');
    }
    
    if (!!subgroup_data.title) {
      var title_el = $('<div class="' + class_prefix + 'title" />');
      title_el.html(subgroup_data.title);
      parent.append(title_el);
      
      if (!!subgroup_data.titleStyle) {
        title_el.attr('style', subgroup_data.titleStyle);
      }
      
      if (!!subgroup_data.collapsible) {
        title_el.append('<div class="' + class_prefix + 'toggle"><span class="' + class_prefix + 'status-close">[展开]</span><span class="' + class_prefix + 'status-open">[折叠]</span></div>');
      }
      
      if (!!subgroup_data.nav) {
        var nav_el = $('<div class="' + class_prefix + 'nav" />');
        title_el.append(nav_el);
        title_el.addClass(class_prefix + 'has-nav');
        
        nav_el.html(subgroup_data.nav);
      }
    }
    
    if (!!subgroup_data.content || !!subgroup_data.subgroup) {
      var content_el = $('<div class="' + class_prefix + 'content" />');
      parent.append(content_el);
      
      if (!!subgroup_data.content) {
        if (!!subgroup_data.contentStyle) {
          content_el.attr('style', subgroup_data.contentStyle);
        }
        
        content_el.html(subgroup_data.content);
      } else {
        var content_subgroup = $('<div class="' + class_prefix + 'subgroup" />').appendTo(content_el);
        $.each(subgroup_data.subgroup, function () {
          navbox_subgroup_build(content_subgroup, this);
        });
      }
    }
  }

  function navbox_build(navbox_data) {
    var flatten_navbox_el = $('<div class="' + class_prefix + 'wrapper" />');
    var subgroup_el = $('<div class="' + class_prefix + 'subgroup" />');
    flatten_navbox_el.append(subgroup_el);
    
    navbox_subgroup_build(subgroup_el, navbox_data.subgroup);
    
    return flatten_navbox_el;
  }

  function navbox(selector) {
    var selector = selector || '.navbox';
    
    $(selector).each(function () {
      var navbox_el = $(this);
      // http://zh.moegirl.org/LoveLive! .navbox in .navbox skip
      if (navbox_el.parents('.navbox').length) return;

      var data = navbox_data(navbox_el);
      var flatten_el = navbox_build(data);
      
      flatten_el.bind('click', function (e) {
        var $this = $(e.target);
        if ($this.parent().hasClass(class_prefix + 'toggle')) {
          $this.closest('.' + class_prefix + 'collapsible').toggleClass(class_prefix + 'open');
          
          e.stopPropagation();
        }
      });
      
      navbox_el.after(flatten_el).hide();
    });
  }

  navbox();
  
  // http://zh.moegirl.org/LoveLive! .navbox in .navbox build
  var nav_in_nav = $('.' + class_prefix + 'wrapper .navbox');
  if (nav_in_nav.length) navbox(nav_in_nav);
});