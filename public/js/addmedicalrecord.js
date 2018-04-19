$(document).on('pageshow', '#addmedicalrecord', function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
    var date = now.getDate() < 9 ? '0' + now.getDate() : now.getDate();
    var hours = now.getHours() < 9 ? '0' + now.getHours() : now.getHours();
    var minutes = now.getMinutes() < 9 ? '0' + (now.getMinutes() + 1) : (now.getMinutes() + 1);
    var datetimestr = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes;
    $("#time").val(datetimestr);
    $("#typeTitle").text(getTitle);
    $('.typeitem').not($('.' + getType())).hide();
})
$(document).on('pageinit', '#addmedicalrecord', function(){
    $('#submit').on('tap', function(){
        var content = $("#content").val();
        var datetimestr = $('#time').val();
        var dataArr = datetimestr.split('T');
        var date = dataArr[0];
        var time = dataArr.length > 0 ? dataArr[1] : '00:00';
        var phone = getSession('phone');
        if (!phone) {
            location.href = 'login.html';
        }
        ajaxFun('post', api_host + 'addRecord', {
            phone: phone,
            date: date,
            time: time,
            type: 'medicalrecord',
            data: {content:content}
        }, function (data) {
            data = JSON.parse(data);
            if (data.code == 200) {
                alert('保存成功！');
                location.replace('medicalrecord.html');
            } else {
                alert('保存失败！请稍后再试');
            }
        })
    })
    $("#cancel").on('tap', function(){
        history.back();
    })

})