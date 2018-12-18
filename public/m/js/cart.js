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
                            beforeSend:function(){
                                $('.spinner').show();
                            },
                            complete:function(){
                                $('.spinner').hide();
                            },
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

      /* 3. 实现计算总金额
                1. 获取当前所有选中的复选框  (添加一个change事件 当复选框选择发生变化时时获取)
                2. 遍历所有选中的复选框  计算每一个复选框的商品价格和数量 为商品单价
                3. 定义一个和把所有商品单价累加就是总金额
                4. 把总金额渲染到页面*/
                $('.cart-list').on('change','.input-checked',function(){
                    var checkBox = $(':checked');
                    var sum = 0;
                    for(var i=0;i<checkBox.length;i++){
                        var price = $(checkBox[i]).data('price');
                        var num = $(checkBox[i]).data('num');
                        var singleCount = price*num;
                        sum += singleCount;
                    }
                    sum = sum.toFixed(2);
                    console.log(sum);
                    $('.order-total span').html(sum);
                });
        /*删除商品
            1.点击删除弹出提示框,是否确认删除
            2.取消回到当页,确认发起请求
            3.获取自定义的id,根据id传递参数
            4.根据返回值判断是否删除成功
            5.成功后重新渲染网页
            6.失败后提示用户删除失败*/
            $('.cart-list').on('tap','.btn-delete',function(){
                var btn = this;
                mui.confirm('您确定要删除商品吗?', '温馨提示', ['确定', '取消'],function(e){
                    if(e.index==0){
                        var id = $(btn).data('id');
                        console.log(id);
                        $.ajax({
                            url:'/cart/deleteCart',
                            data:{id:id},
                            beforeSend:function(){
                                $('.spinner').show();
                            },
                            complete:function(){
                                $('.spinner').hide();
                            },
                            success:function(data){
                                if(data.error){
                                    mui.alert('删除失败!');
                                }else{
                                    page = 1;
                                    queryCart();
                                    mui('#refreshContainer').pullRefresh().refresh(true);
                                    $('.order-total span').html('0.00');
                                }
                            }
                        })
                    }else {
                             //点击了取消 把当前列表滑动回去
                    // 1. 获取当前要滑动回去的li 只能使用dom元素 不能是zpeto对象
                    var li = btn.parentNode.parentNode;
                    // 2. 调用官方的滑动关闭函数
                    mui.swipeoutClose(li);
                }
            })
            });
            $('.cart-list').on('tap','.btn-edit',function(){
                var that = this;
                var product = $(this).data('product');
                var min = product.productSize.split('-')[0]-0;
                var max = product.productSize.split('-')[1];
                product.productSize = [];
                // 遍历数组,将数组中的数字添加到尺码当中
                for(var i=min;i<=max;i++){
                    product.productSize.push(i);
                }
                var html = template('editCartTpl',product).replace(/[\r\n]/g, '');
                mui.confirm(html,'商品编辑',['确定','取消'],function(e){
                    if(e.index == 0){
                        $.ajax({
                            url:'/cart/updateCart',
                            type:'post',
                            data:{id:product.id,size:$('.product-size .mui-btn-warning').html(),num:mui('.mui-numbox').numbox().getValue()},
                            success:function(data){
                                if(data.success){
                                    queryCart();
                                    console.log(product.size);
                                }
                            }
                        })
                    }else{
                        mui.swipeoutClose(that.parentNode.parentNode);
                    }
                });
                mui('.mui-numbox').numbox().setValue(product.num);
                $('.product-size .btn-size').on('tap',function(){
                    $(this).addClass('mui-btn-warning').siblings().removeClass("mui-btn-warning");
                })
            })
            function queryCart(){
              $.ajax({
                url:'/cart/queryCartPaging',
                data:{page:1,pageSize:4},
                beforeSend:function(){
                    $('.spinner').show();
                },
                complete:function(){
                    $('.spinner').hide();
                },
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
                        console.log(data);
                    }
                }
            })
          };
      })