$(function(){
    var registerUrl = getQueryString('registerUrl');
    $('.btn-register').on('tap',function(){
        location = 'register.html';
    })
    $('.btn-login').on('tap',function(){
        var username = $('.username').val();
        var password =$('.password').val();
        if(!username){
            mui.alert('用户名不能为空!');
            return false;
        }
        if(!password){
            mui.alert('密码不能为空!');
            return false;
        }
        $.ajax({
            url:'/user/login',
            type:'post',
            data:{username:username,password:password},
            success:function(data){
                if(data.success){
                    location = registerUrl;
                    console.log(registerUrl);
                }else {
                    mui.toast(data.message, { duration: 3000, type: 'div' });
                }
            }
        })
    })
             // 根据url参数名取值
             function getQueryString(name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                // console.log(r);
                if (r != null) {
                    //转码方式改成 decodeURI
                    return decodeURI(r[2]);
                }
                return null;
            }
        });