$(document).ready(function () {
    var navButton = $(".navButton");
    navButton.fadeTo("fast", 0.7);
    $(".brand").fadeTo("fast", 1);
    navButton.mousedown(function () {
        $(this).addClass('navButtonDown');
    });
    navButton.mouseup(function () {
        $(this).removeClass('navButtonDown');
        if (!$(this).hasClass('brand'))
            $(this).fadeTo("fast", 0.7);
    });
    navButton.hover(function () {
        $(this).addClass('navButtonHover');
        $(this).fadeTo("fast", 1.0);
    }, function () {
        $(this).removeClass('navButtonHover').removeClass('navButtonDown');
        if (!$(this).hasClass('brand'))
            $(this).fadeTo("fast", 0.7);
    });
    var page = "home.html";
    var intelliJ = '\n<a href="http://www.jetbrains.com/idea/"><img src="images/icon_IntelliJIDEA.png" alt="The best Java IDE" border="0" style="float: right"/></a>\n';
    var pageIndex = document.location.href.indexOf("?page=");
    if (pageIndex !== -1)
        page = document.location.href.substring(pageIndex + 6);
    $.ajax({
        url: page,
        dataType: 'html',
        success: function (data) {
            $('#container').html(intelliJ + data + '<p>&nbsp;</p>');
        }
    });
    navButton.click(function () {
        if ($(this).attr("id") === undefined) {
            return;
        }
        $('#container').html('<div style="position:relative">' + intelliJ + '<h2>Loading...</h2></div>');
        var contentId = $(this).attr("id").replace('Link', '');
        $.ajax({
            url: contentId + '.html?v=1024c',
            dataType: 'html',
            success: function (data) {
                $('#container').html(intelliJ + data + '<p>&nbsp;</p>');
            }
        });
    });
});
