$(function () {
    /*1. 商品搜素
        1. 拿到搜索页面传递过来参数?search=鞋# 拿到参数中鞋
        2. 调用查询商品列表的API查询商品列表数据
        3. 创建商品列表的模板 传入数据
        4. 把模板渲染到页面*/
    // 1. 获取url中的参数的值 按照=分割取第二个值(索引是1) 进行转码
    var search = getQueryString('search');
    // 2. 调用商品列表的APi
    getProductList();
    $('.btn-search').on('tap',function(){
        search = $('.input-search').val();
         //搜索框内容非空判断
         if(!search.trim()){
            //为空弹出提示框
            alert('请输入要搜索商品');
            return;
        }
        page = 1;
        getProductList();
    });
    function getProductList(){
        $.ajax({
            url:'/product/queryProduct',
        // page 第几页 pageSize 每页大小 proName搜索关键字
        data:{page:1,pageSize:2,proName:search},
        success:function (data) {
            // 3. 调用模板生成html
            var html = template('productTpl',data);
            // 4. 渲染到商品列表内容的ul
            $('.product-content ul').html(html);
        }
    })
    }
    //排序按钮添加点击事件
    $('.product-list ul li a').on('tap',function(){
        //获取自定义的排序类型
        var sortType = $(this).data('sort-type');
        //获取自定义的排序参数
        var sort = $(this).data('sort');
        //当参数为1的时候,点击按钮修改为2
        if(sort == 1){
            sort = 2;
            // 将箭头的指向改为向上
            $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
        }else {
            sort = 1;
            $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        //点击按钮给li添加active类
        $(this).parent().addClass('active').siblings().removeClass('active');
        //将修改后的排序参数设置到页面属性上
        $(this).data('sort', sort);
        //将发送请求的参数保存到数组里,方便进行排序的类型判断
        var params = {page:1,pageSize:2,proName:search};
        //将排序类型根据点击的不同按钮动态添加到发送请求的参数中
        params[sortType] = sort;
        //发送排序请求并渲染到页面上
        $.ajax({
            url:'/product/queryProduct',
        // page 第几页 pageSize 每页大小 proName搜索关键字
        data:params,
        success:function (data) {
            // 3. 调用模板生成html
            var html = template('productTpl',data);
            // 4. 渲染到商品列表内容的ul
            $('.product-content ul').html(html);
        }
    })
    });
    var page=1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {
                contentdown: "你正在进行下拉还可以继续拉...",
                contentover: "你已经拉到了可以刷新的位置 可以松手了",
                contentrefresh: "正在给你拼命刷新数据...",
                callback: function() { //下拉刷新的回调函数 进行数据请求 下拉松手后就会还执行
                    //本地速度很快 加一个定时器延迟1秒钟执行请求和结束下拉效果
                    setTimeout(function() {
                        // 2. 拉了之后请求数据刷新页面 发请求刷新数据即可
                        getProductList();
                        // 3. 当数据请求完毕页面刷新完毕后 结束下拉刷新  函数版本不一样 函数名不一样 注意当前结束函数
                        // endPulldownToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 9. 下拉完成后 重置这个上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 10. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            // 初始化上拉
            up: {
                contentrefresh: "正在拼命加载更多数据...",
                contentnomore: '再下实在是给不了更多!',
                callback: function() {
                    // 请求更多数据 在页面中去追加
                    // 如果请求更多数据 修改参数的page值 第一页是1  第二页2 第三页3
                    setTimeout(function() {
                        // 5. 每次上拉让当前的page++
                        page++;
                        // 6. 调用API传入对应的参数 请求++之后的数据
                        $.ajax({
                            url: '/product/queryProduct',
                            // page 第几页使用当前++后的page变量 pageSize 每页大小 proName搜索关键字
                            data: { page: page, pageSize: 2, proName: search },
                            success: function(data) {
                                // 7. 判断数据还有没有长度 有长度表示有数据 追加 没长度 表示没有数据 就结束下拉并且提示没有数据
                                // data是对象 {data:[]}  data.data取 data对象里面的data数组 里面data数组的.length
                                if (data.data.length > 0) {
                                    // 7.1 调用模板生成html
                                    var html = template('productTpl', data);
                                    // 7.2 追加到商品列表内容的ul
                                    $('.product-content ul').append(html);
                                    // 7.3 加载完成后结束上拉加载的效果 MUI 结束上拉的函数endPullupToRefresh
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                }else{
                                    // 8. 没有长度提示没有数据 了 endPullupToRefresh提示没有数据传人一个true
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });
    //立即购买按钮点击事件
    $('.product-content ').on('tap','.btn-buy',function(){
        //获取自定义的id属性
        var id = $(this).data('id');
        // 跳转到商品详情页面并传递当前商品的id
        location = 'detail.html?id='+id;
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