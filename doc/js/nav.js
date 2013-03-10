$(document).ready(function() {
  var buttonColour = {};
  $(".navButton").fadeTo("fast", 0.7);
  $(".brand").fadeTo("fast", 1);
  $(".navButton").mousedown(function() {
    $(this).addClass('navButtonDown');
  });
  $(".navButton").mouseup(function() {
    $(this).removeClass('navButtonDown');
    if (!$(this).hasClass('brand'))
      $(this).fadeTo("fast", 0.7);
  });
  $(".navButton").hover(function() {
    $(this).addClass('navButtonHover');
    $(this).fadeTo("fast", 1.0);
  }, function() {
    $(this).removeClass('navButtonHover').removeClass('navButtonDown');
    if (!$(this).hasClass('brand'))
      $(this).fadeTo("fast", 0.7);
  });
  $.ajax({
    url: 'home.html',
    dataType:'html',
    success: function(data) {
      $('#container').html(data+'<p>&nbsp;</p>');
    }
  });
  $(".navButton").click(function() {
    if ($(this).attr("id") === undefined) {
      return;
    }
    $('#container').html('<div style="position:relative"><h2>Loading...</h2></div>');
    var contentId = $(this).attr("id").replace('Link', '');
    $.ajax({
      url: contentId + '.html?v=026',
      dataType:'html',
      success: function(data) {
      $('#container').html(data+'<p>&nbsp;</p>');
    }
    });
  });
});
