$(document).on('pageinit', '#index', function () {
    $('.daily_item').on('tap',function(){
        var type = $(this).attr('data-mytype');
        location.href = 'blood.html?type='+type;
    })
})