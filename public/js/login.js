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
    $("#submit").on('tap',function() {
        var form = $('#form_pass').attr('data-form');
        var phone = $("#phone").val().trim();
        if (phone == '') {
            alert('请输入手机号码');
            return;
        }
        var phone_default = '18826139825'
        var pass_default = '123456'
        var vercode_default = '1234'
        if (form == '1') {/* 密码登陆 */
            var password = $("#password").val().trim();
            if (password == '') {
                alert('请输入密码')
            }else if (phone == phone_default && password == pass_default) {
                location.href = 'index.html'
            } else {
                alert('密码或手机号错误，请重新输入');
                $("#phone").val('');
                $("#password").val('');
            }
        } else {/* 手机验证码 */
            var vercode = $("#verificationCode").val().trim();
            if (vercode == '') {
                alert('请输入验证码');
                return ; 
            }
            if (vercode == vercode_default) {
                location.href = 'index.html'
            } else {
                alert('手机号或验证码错误，请重新输入');
                $("#verificationCode").val('');
            }
        }
        
    })
})

$(document).on('pageinit','#setPassword',function(){
    $('#setpass_submit').on('tap',function(){
        var setpass_phone = $("#setpass_phone").val().trim();
        var setpass_password = $("#setpass_password").val().trim();
        var setpass_repassword = $("#setpass_repassword").val().trim();
        var setpass_verificationCode = $("#setpass_verificationCode").val().trim();

        if (setpass_phone == '') {
            alert('请输入手机号');
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
        if (setpass_verificationCode == '') {
            alert('请输入验证码');
            return;
        }
        
        if (setpass_password != setpass_repassword) {
            alert("两次输入密码不相同");
            return;
        }

        var vercode_default = '1234'


        if (setpass_verificationCode == vercode_default) {
            alert('设置密码成功');
            location.href = 'login.html';
        }
        else{
            alert('验证码错误');
        }

    })
})