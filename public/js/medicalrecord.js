$(document).on('pageshow','#medicalrecord',function(){
    $.mobile.ajaxLinksEnabled = false;
    var phone = getSession('phone');
    if (!phone) {
        location.href = 'login.html';
    }
    //请求历史数据
    ajaxFun('post', api_host + 'getRecords', {
        phone: phone,
        type: 'medicalrecord'
    }, function (data) {
        data = JSON.parse(data);
        data = data.data.data;   
        var htmlStr = '';
        for(var i = 0; i < data.length; i++){
            var liStr = '';
            for (j = 0; j < data[i].times.length; j++) {
                liStr += '<li><a href="editmedicalrecord.html?id=' + data[i].times[j].id +'" data-ajax="false"><span>' + data[i].times[j].data.content + '</span><span class="ui-li-count">' + data[i].times[j].time+'</span></a></li>';
            }
            htmlStr += '<div data-role="collapsible" data-theme="b" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u"><h3> '+data[i].date+' </h3><ul data-role="listview">'+liStr+'</ul></div >';
        }
        $('#history-data').append(htmlStr).trigger('create');
    })
})
$(document).on('pageinit', '#medicalrecord', function(){
    $('.back_btn').on('tap',function(){
        location.href = 'index.html';
    })
})