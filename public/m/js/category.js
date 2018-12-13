$(function() {
    //获取区域滚动的父容器 调用初始化区域滚动插件的函数
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false //是否显示滚动条
    });
    //发送请求,获取分类信息
    $.ajax({
        url:'/category/queryTopCategory',
        success:function (data){
            var html = template('categoryTpl',data);
            $('.category-left ul').html(html);
        }
    });
    //给分类按钮添加异步添加点击事件 事件委托
    $('.category-left ul').on('tap', 'li a', function() {
        // 获取自定义的id
        var id = $(this).data('id');
        // 渲染对应ID的内容
        getSecondCategory(id);
        //点击添加active 其余兄弟删除active
        $(this).parent().addClass("active").siblings().removeClass("active");
    });
    //首次渲染第一个分类的内容
    getSecondCategory(1);
    // 分类内容获取函数
    function getSecondCategory(id){
        $.ajax({
            data:{id:id},
            url:'/category/querySecondCategory',
            success:function (data){
                var html = template('secondCategoryTpl',data);
                $('.category-right ul').html(html);
            }
        })
    }
})
