$(document).on('pageshow','#report',function(){
    var phone = getSession('phone');
    //请求最新一条记录
    ajaxFun('post', api_host + 'getReport', {
        phone: phone
    }, function (data) {
        data = JSON.parse(data);
        console.log(data);
    })
})