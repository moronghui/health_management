$(document).on('pageinit', '#index', function () {
    $('.item_info').on('tap', function(){
        var type = $(this).attr('data-mytype');
        location.href = 'blood.html?type='+type;
    })
    $('.medicalrecord').on('tap', function(){
        location.href = 'medicalrecord.html';
    })
})