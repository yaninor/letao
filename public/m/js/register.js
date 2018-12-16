$(function(){
    var vCode = '';
    $('.btn-vcode').on('tap',function(){
        $.ajax({
            url:'/user/vCode',
            success:function(data){
                console.log(data.vCode);
                vCode = data.vCode;
            }
        })
    });
    $('.btn-login').on('tap',function(){
        var mobile = $('.mobile').val();
        var username = $('.username').val();
        var password1 = $('.password1').val();
        var password2 = $('.password2').val();
        var vcode = $('.vcode').val();
        var check = true;
        mui(".mui-input-group input").each(function() {
        //若当前input为空，则alert提醒
        if(!this.value || this.value.trim() == "") {
            var label = this.previousElementSibling;
            mui.alert(label.innerText + "不允许为空!");
            check = false;
            return false;
        }
        }); //校验通过，继续执行业务逻辑
        if(check){
            if(!(/^1[34578]\d{9}$/.test(mobile))){
                mui.alert('手机号码有误,请重新输入!');
                return false;
            }
            if(username.length>10){
                mui.alert('用户名长度不对,请重新输入(小于10)!');
                return false;
            }
            if(password1 != password2){
                mui.alert('两次密码不一致,请重新输入!');
                return false;
            }
            if(vcode != vCode){
                mui.alert('验证码有误,请重新输入!');
                return false;
            }
            $.ajax({
                url:'/user/register',
                type:'post',
                data:{username:username,password:password1,mobile:mobile,vCode:vcode},
                success:function(data){
                    if(data.error){
                        mui.alert(data.message);
                    }else {
                        location = 'login.html';
                    }
                }
            })
        }
    })
});