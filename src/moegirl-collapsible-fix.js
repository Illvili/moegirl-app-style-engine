$(function () {
  $('.mw-collapsible').each(function () {
    var col_table = $(this);
    
    if (col_table.parents('.navbox').length) return;
    
    var col_trs = col_table.find('> tbody> tr');
    var col_controler = $('<div class="collapse-toggle"><span class="collapse-status-close">[展开]</span><span class="collapse-status-open">[折叠]</span></div>');
    col_controler.on('click', function () {
      col_table.toggleClass('mw-collapsed');
    });
    
    col_trs.first().children().first().append(col_controler);
  });
});