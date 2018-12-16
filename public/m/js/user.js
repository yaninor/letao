$(function(){
    $.ajax({
        url:'/user/queryUserMessage',
        success:function(data){
            if(data.error){
                location = 'login.html?registerUrl='+location.href;
            }else {
                $('.username').html(data.username);
                $('.mobile').html(data.mobile);
            }
        }
    });
    $('.btn-logout').on('tap',function(){
        $.ajax({
            url:'/user/logout',
            success:function(data){
                if(data.success){
                    location = 'login.html?registerUrl='+location.href;
                }
            }
        })
    })
});