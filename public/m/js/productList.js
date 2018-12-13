$(function () {
    /*1. 商品搜素
        1. 拿到搜索页面传递过来参数?search=鞋# 拿到参数中鞋
        2. 调用查询商品列表的API查询商品列表数据
        3. 创建商品列表的模板 传入数据
        4. 把模板渲染到页面*/
    // 1. 获取url中的参数的值 按照=分割取第二个值(索引是1) 进行转码
    var search = decodeURI(location.search.split('=')[1]);
    // 2. 调用商品列表的APi
    getProductList(search);
    $('.btn-search').on('tap',function(){
        getProductList($('.input-search').val());
    });
    function getProductList(search){
        $.ajax({
            url:'/product/queryProduct',
        // page 第几页 pageSize 每页大小 proName搜索关键字
        data:{page:1,pageSize:4,proName:search},
        success:function (data) {
            // 3. 调用模板生成html
            var html = template('productTpl',data);
            console.log(data);
            // 4. 渲染到商品列表内容的ul
            $('.product-content ul').html(html);
        }
    })
    }

})