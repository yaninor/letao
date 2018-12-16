$(function(){
     /* 1. 动态渲染购物车的商品信息
        1. 页面加载请求购物车的商品的数据  请求查询购物车的API接口 带分页的
        2. 创建购物车列表模板 渲染模板
        */
        queryCart();
          /*
        下拉刷新和上拉加载购物车
        1. 添加下拉上拉结构
        2. 初始化下拉刷新和上拉加载
        3. 在下拉刷新的函数请求最新的数据
        4. 结束下拉刷新的效果(不结束会一直转)
        5. 定义一个page = 1;
        6. 上拉加载的回调函数让page++
        7. 请求page++了之后的更多的数据
        8. 追加append到购物车的列表
        9. 结束上拉加载效果
        10. 判断如果没有数据的时候结束并且提示没有数据了  调用结束上拉加载效果传递一个true
        11. 下拉结束后重置上拉加载的效果
        12. 把page也要重置为1
        */
        var page=1;
        mui.init({
           pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {
                callback: function() {
                    // 模拟请求网络请求延迟
                    setTimeout(function() {
                        // 3. 在下拉刷新的函数请求最新的数据
                        queryCart();
                        // 4. 结束下拉刷新的效果(不结束会一直转) 在官方文档函数后 多加一个 ToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 11. 下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 12. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            up: {
                callback: function (){
                    setTimeout(function(){
                        page++;
                        $.ajax({
                            url:'/cart/queryCartPaging',
                            data:{page:page,pageSize:4},
                            success:function(data){
                                if(data.error){
                                    location = 'login.html?registerUrl='+location.href;
                                }else{
                                    if(data instanceof Array){
                                        data = {
                                            data:data
                                        }
                                    }
                                     if (data.data.length > 0) {
                                        // 调用模板方法生成html
                                        var html = template('cartListTpl', data);
                                        // 8. 追加append到购物车的列表
                                        $('.cart-list').append(html);
                                        // 9. 结束上拉加载效果
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                    } else {
                                        // 10. 结束上拉加载效果提示没有数据了
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }
                                }
                            }
                        })
                    },1000);
                }
            }
        }
    });
        function queryCart(){
          $.ajax({
            url:'/cart/queryCartPaging',
            data:{page:1,pageSize:4},
            success:function(data){
                if(data.error){
                    location = 'login.html?registerUrl='+location.href;
                }else{
                    if(data instanceof Array){
                        data = {
                            data:data
                        }
                    }
                    var html = template('cartListTpl',data);
                    $('.cart-list').html(html);
                }
            }
        })
      }

  })