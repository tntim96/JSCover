$(document).ready(function() {
//     var buttonColour = {};
// //    $(".navButton").css('background-color', '#993333');
//     $(".navButton").css('background-color', '#cccccc');
//     $(".navButton").fadeTo("slow", 0.7);
//     $(".navButton").mousedown(function() {
//         $(this).css('cursor', 'hand').css('color', '#6699ff').css('border', '2px solid #6699ff').css('text-shadow', '#6699ff 0px 0px 5px');
//     });
//     $(".navButton").mouseup(function() {
//         $(this).css('cursor', 'hand').css('color', '#336699').css('border', '2px solid #336699').css('text-shadow', '#336699 0px 0px 5px');
//     });
//     $(".navButton").hover(function() {
// //        $(this).css('cursor', 'hand').css('background-color', '#006633').css('color', '#99ffee').css('border', '1px solid #eeeeff').css('text-shadow', '#66ff99 0px 0px 10px');
//         $(this).css('cursor', 'hand').css('color', '#336699').css('border', '2px solid #336699').css('text-shadow', '#336699 0px 0px 5px');
//         $(this).fadeTo("fast", 1.0);
//     }, function() {

// //        var backgroundColour = $(this).hasClass('clicked') ? '#006633' : '#993333';
//         $(this).fadeTo("slow", 0.7).css('color', '#000000').css('border', '2px solid #000000').css('text-shadow', 'none');
// //        $(this).fadeTo("slow", 0.7).css('background-color', backgroundColour).css('color', '#000000').css('border', '1px solid #444444').css('text-shadow', 'none');
//     });
    $.ajax({
            url: 'home.html',
            dataType:'html',
            success: function(data) {
                $('#container').html(data+'<p>&nbsp;</p>');
            }
        });
    $(".navButton").click(function() {
        // $(this).addClass('clicked');
        if ($(this).attr("id") === undefined) {
            return;
        }
        $('#container').html('<div style="position:relative"><h2>Loading...</h2></div>');
        var contentId = $(this).attr("id").replace('Link', '');
        $.ajax({
            url: contentId + '.html?v=011',
            dataType:'html',
            success: function(data) {
                $('#container').html(data+'<p>&nbsp;</p>');
            }
        });
    });
});
