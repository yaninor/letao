$(function(){
    //获取传递过来的id
    var id =getQueryString('id');
    // 发起请求 返回查询id的详情
    $.ajax({
        url:'/product/queryProductDetail',
        data:{id:id},
        success:function(data){
            //根据传递过来的尺码35-45截取最大 最小值
            var min = data.size.split('-')[0]-0;
            var max = data.size.split('-')[1];
            data.size = [];
            // 遍历数组,将数组中的数字添加到尺码当中
            for(var i=min;i<=max;i++){
                data.size.push(i);
            }
            console.log(data);
             // 4. 调用商品详情的模板生成html
            var html = template('productDetailTpl', data);
            $('#productDetail').html(html);
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            // 等轮播图结构出来了之后再初始化轮播图
            mui('.mui-slider').slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
             //数字框也是动态添加要手动初始化
            mui('.mui-numbox').numbox();
            //尺码默认也是不能点击的手动初始化
            $('.btn-size').on('tap', function() {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    });
    //添加到购物车点击事件
    $('.btn-add-cart').on('tap',function(){
         var size = $('.btn-size.active').data('size');
        //判断如果尺码没有选择 提示用户选择尺码
        if (!size) {
            // toast 消息提示框 提示用户选择尺码 第一个参数 提示内容 第二个参数提示配置项
            mui.toast('请选择尺码！', { duration: 3000, type: 'div' });
            // 注意当用户没有选择 后面的代码不执行的要return  return false 不仅结束还可以阻止默认行为
            return false;
        }
        //  获取当前选择的数量
        var num = mui('.mui-numbox').numbox().getValue();
        // 判断是否选择了数量
        if (!num) {
            mui.toast('请选择数量！', { duration: 3000, type: 'div' });
            return false;
        }
        //将数据提交到服务器
        $.ajax({
            url:'/cart/addCart',
            data:{productId:id,size:size,num:num},
            type:'post',
            success:function(data){
                console.log(data);
                    // 加入失败 先去完整版登录
                    // 判断加入购物车是否成功 如果返回值success表示成功 成功提示用户去购物车查看
                    if(data.success){
                        // 提示用户是否去购物车查看
                        // 第一个参数是提示的内容 第二个参数是提示的标题 第三个参数是提示按钮的文字(数组)  第四个的回调函数 当点击按钮的后会触发的回调函数
                        mui.confirm('加入购物车成功！ 是否要去购物车查看?', 'hello 单身狗', ['去看','发呆','不看'], function(e){
                            // 获取当前用户点击了左边的还是右边
                            console.log(e);
                            if(e.index == 0){
                                //点击了左边 跳转到购物车查看
                                location = 'cart.html';
                            }else{
                                // 点击否就不看 表示还继续吗
                                mui.toast('你继续加一件就可以脱离单身了！', { duration: 3000, type: 'div' });
                            }
                        });
                    }else {
                        var registerUrl = location.href;
                        location = 'login.html?registerUrl='+registerUrl;
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