$(document).on('pageshow','#report',function(){
    showLoading('正在生成报告...');  
    var phone = getSession('phone');
    //请求最新一条记录
    ajaxFun('post', api_host + 'getReport', {
        phone: phone
    }, function (data) {
        data = JSON.parse(data);
        data = data.data.data;
        console.log(data);
        var htmlStr = '';
        for (var i = 0; i < data.length; i++) {
            htmlStr += '<div class="item"><div class="header">' + getTitle(data[i].type) +'</div ><div class="content">'+ data[i].content +'</div></div >';
        }
        $('#content').append(htmlStr).trigger('create');
    }, function(){
        hideLoading();
    })
})