$(function() {

    var w_height = $(window).height();

    $(".room-container").css("height",(w_height-60)+"px");

    var user_container_height = $(".room-container").height();


    $(".user-info").css("height",(user_container_height-50)+"px");

    var screen_width = $(window).width();

    $(".messages").css("height",(user_container_height-180)+"px")

            $(".messages-container").css("width",(screen_width-325)+"px")
});