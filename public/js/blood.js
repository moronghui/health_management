$(document).on('pageshow','#blood',function(){
    var phone = getSession('phone');
    if (!phone) {
        location.href = 'login.html';
    }
    $("#typeTitle").text(getTitle());
    $('#record_btn').text('记录'+getTitle());
    //请求最新一条记录
    ajaxFun('post', api_host + 'latestRecord', {
        phone: phone,
        type: getType()
    }, function (data) {
        data = JSON.parse(data);
        data = data.data.data;
        if (data.length > 0) {
            $('#latestRecord').text(getData(data[0].data));
            $('#latestUnit').text(getUnit());
        }else{
            $('#latestRecord').text('您还没记录');
        }
    })
    //请求历史数据
    ajaxFun('post', api_host + 'getRecords', {
        phone: phone,
        type: getType()
    }, function (data) {
        data = JSON.parse(data);
        data = data.data.data;   
        var htmlStr = '';
        for(var i = 0; i < data.length; i++){
            var liStr = '';
            for (j = 0; j < data[i].times.length; j++) {
                liStr += '<li><a href="#"><span>' + getData(data[i].times[j].data) + getUnit() + '</span><span class="ui-li-count">' + data[i].times[j].time+'</span></a></li>';
            }
            htmlStr += '<div data-role="collapsible" data-theme="b" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u"><h3> '+data[i].date+' </h3><ul data-role="listview">'+liStr+'</ul></div >';
        }
        $('#history-data').append(htmlStr).trigger('create');
    })
})
$(document).on('pageinit', "#blood", function() {
    $('#record_btn').on('click', function(){
        location.replace('addRecord.html?type=' + getType());
    })
})