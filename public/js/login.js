$(document).on("pageinit","#login",function(){
    //密码登陆
    $('#form_pass').on('tap',function(){
        $(this).attr('data-form','1');
        $('.verificationCode').hide();
        $('.password').show();
    })
    //手机验证码登陆
    $('#form_phone').on('tap',function() {
        $('#form_pass').attr('data-form', '0');
        $('.verificationCode').show();
        $('.password').hide();
    })
    //点击登录
    $("#submit").on('tap',function() {
        var form = $('#form_pass').attr('data-form');
        var phone = $("#phone").val().trim();
        if (phone == '') {
            alert('请输入手机号码');
            return;
        }

        if (form == '1') {/* 密码登陆 */
            var password = $("#password").val().trim();
            if (password == '') {
                alert('请输入密码')
            }
            ajaxFun('get', api_host + 'login', { password: password, phone: phone }, function (data) {
                data = JSON.parse(data);
                if (data.code == 200) {
                    //将登陆手机号和token存入客户端的sessionStorage
                    setSession('phone', phone);
                    setSession('token', data.data.token);
                    location.href = 'index.html'
                } else if (data.code == 202) {
                    alert('用户不存在，请重新输入');
                } else if (data.code == 104){
                    alert('服务器繁忙，请稍后再试！')
                } else{
                    alert('手机号或密码错误，请重新输入');
                }
            }, function () { })
        } else {/* 手机验证码 */
            var vercode = $("#verificationCode").val().trim();
            if (vercode == '') {
                alert('请输入验证码');
                return ; 
            }
            ajaxFun('POST', api_host +'vercaptcha', {captcha:vercode,phone: phone}, function(data){
                data = JSON.parse(data);
                if (data.code == 200) {
                    //将登陆手机号和token存入客户端的sessionStorage
                    setSession('phone', phone);
                    setSession('token', data.data.token);
                    location.href = 'index.html'
                }else{
                    alert('手机号或验证码错误，请重新输入');
                    $("#verificationCode").val('');
                }
            },function(){})
        }
        
    })
    //点击发送验证码
    var setFlag = false;
    $('#setcaptcha').on('tap',function(){
        if (setFlag) {
            return;
        }
        var _this = $(this);
        var imagecode = $("#imagecode").val().trim();
        var phone = $("#phone").val().trim();
        /** 检验手机号是否合法 */
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(phone)) {
            alert('请输入正确的手机号码！');
            return;
        } 
        if (imagecode == '') {
            alert('请输入图形验证码！');
            return;
        }
        //判断图形验证码是否正确
        ajaxFun('GET', api_host+'verCode', { code: imagecode},function(data){
            data = JSON.parse(data);
            if (data.code == 200) {/*图形验证码正确 */
                setFlag = true;
                _this.removeClass('no_set');
                _this.addClass('set');
                var count = 60
                var timer;
                var btn = _this;
                btn.text('验证码(' + count + ')');
                timer =  setInterval(function() {
                    count--;
                    if(count <= 0){
                        btn.text('发送验证码');
                        clearInterval(timer);
                        setFlag = false;
                        btn.addClass('no_set');
                        btn.removeClass('set');
                        return;
                    }
                    btn.text('验证码('+count+')');
                },1000)
                //请求发送验证码接口
                ajaxFun('POST', api_host +'sendCaptcha', {phone:phone,token:$.md5($.md5(phone))}, function(data) {}, function(data){})
            }else{
                alert('图形验证码错误');
                $("#login_img").attr('src', api_host + 'getCode?v=' + Math.floor(Math.random() * 1000));
            }
        },function(){})
    })


})

$(document).on("pageshow","#login",function(){
    $("#login_img").attr('src', api_host + 'getCode?v=' + Math.floor(Math.random()*1000));//动态刷新图形验证码
    $("#login_img").on('tap', function(){
        $("#login_img").attr('src', api_host + 'getCode?v=' + Math.floor(Math.random() * 1000));
    })
    var form = $('#form_pass').attr('data-form');
    if (form == '1') {
        $('#form_pass').addClass('ui-btn-active');
        $('#form_phone').removeClass('ui-btn-active');
    }else{
        $('#form_phone').addClass('ui-btn-active');
        $('#form_pass').removeClass('ui-btn-active');
    }
})

$(document).on('pageinit','#setPassword',function(){
    //点击发送验证码
    var setFlag = false;
    $('#setpass_setcaptcha').on('tap', function () {
        if (setFlag) {
            return;
        }
        var _this = $(this);
        var imagecode = $("#setpass_imagecode").val().trim();
        var phone = $("#setpass_phone").val().trim();
        var setpass_password = $("#setpass_password").val().trim();
        var setpass_repassword = $("#setpass_repassword").val().trim();
        if (phone == '') {
            alert('请输入手机号');
            return;
        }
        /** 检验手机号是否合法 */
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(phone)) {
            alert('请输入正确的手机号码！');
            return;
        }
        if (setpass_password == '') {
            alert('请输入密码');
            return;
        }
        if (setpass_repassword == '') {
            alert('请输入确认密码');
            return;
        }
        if (setpass_password != setpass_repassword) {
            alert('两次输入密码不一致！');
            return;
        }
        if (imagecode == '') {
            alert('请输入验证码');
            return;
        }
        //判断图形验证码是否正确
        ajaxFun('GET', api_host + 'verCode', { code: imagecode }, function (data) {
            data = JSON.parse(data);
            if (data.code == 200) {/*图形验证码正确 */
                setFlag = true;
                _this.removeClass('no_set');
                _this.addClass('set');
                var count = 10
                var timer;
                var btn = _this;
                btn.text('验证码(' + count + ')');
                timer = setInterval(function () {
                    count--;
                    if (count <= 0) {
                        btn.text('发送验证码');
                        clearInterval(timer);
                        setFlag = false;
                        btn.addClass('no_set');
                        btn.removeClass('set');
                        return;
                    }
                    btn.text('验证码(' + count + ')');
                }, 1000)
                //请求发送验证码接口
                ajaxFun('POST', api_host + 'sendCaptcha', { phone: phone, token: $.md5($.md5(phone)) }, function (data) { }, function (data) { })
            } else {
                alert('图形验证码错误');
                $("#setpass_img").attr('src', api_host + 'getCode?v=' + Math.floor(Math.random() * 1000));
            }
        }, function () { })
    })
    //点击确定设置密码
    $('#setpass_submit').on('tap',function(){
        var setpass_phone = $("#setpass_phone").val().trim();
        var setpass_password = $("#setpass_password").val().trim();
        var setpass_repassword = $("#setpass_repassword").val().trim();
        var setpass_verificationCode = $("#setpass_verificationCode").val().trim();

        if (setpass_phone == '') {
            alert('请输入手机号');
            return;
        }
        /** 检验手机号是否合法 */
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(setpass_phone)) {
            alert('请输入正确的手机号码！');
            return;
        }
        if (setpass_password == '') {
            alert('请输入密码');
            return;
        }
        if (setpass_repassword == '') {
            alert('请输入确认密码');
            return;
        }
        if (setpass_password != setpass_repassword) {
            alert('两次输入密码不一致！');
            return;
        }
        if (setpass_verificationCode == '') {
            alert('请输入验证码');
            return;
        }
        //请求设置密码接口
        ajaxFun('POST', api_host + 'setpassword', { 
            captcha: setpass_verificationCode,
            phone: setpass_phone,
            password: setpass_password
        }, function(data){
            data = JSON.parse(data);
            if (data.code == 200) {
                alert('设置密码成功');
                location.href = 'login.html';
            } else {
                alert('手机号或验证码错误，请重新输入');
                $("#setpass_verificationCode").val('');
            }
        }, function(){})

    })
})

$(document).on("pageshow", "#setPassword", function () {
    $("#setpass_img").attr('src', api_host + 'getCode?v=' + Math.floor(Math.random() * 1000));//动态刷新图形验证码
    $("#setpass_img").on('tap', function () {
        $("#setpass_img").attr('src', api_host + 'getCode?v=' + Math.floor(Math.random() * 1000));
    })
})