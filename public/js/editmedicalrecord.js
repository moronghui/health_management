$(document).on('pageshow', '#addmedicalrecord', function () {
    //请求该条医疗记录的详细信息
    
    ajaxFun('post', api_host + 'getRecordById', {
        type: 'medicalrecord',
        id: getQueryId()
    }, function (data) {
        data = JSON.parse(data);
        if (data.code == 200) {
            data = data.data.data;
            $('#content').val(data.data.content);
            $("#time").val(data.date + 'T' + data.time);
        }
    })
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
        ajaxFun('post', api_host + 'updateById', {
            phone: phone,
            date: date,
            time: time,
            type: 'medicalrecord',
            id: getQueryId(),
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