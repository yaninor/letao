$(function(){
    //搜索按钮添加点击事件
    $('.btn-search').on('tap',function(){
        //获取搜索框内容
        var search = $('.input-search').val();
        //搜索框内容非空判断
        if(!search.trim()){
            //为空弹出提示框
            alert('请输入要搜索商品');
            return;
        }
        //获取本地存储的数据并转换为js数组或对象  没有数据就为空数组
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        //判断本地存储的数据与获取的搜索框内容是否重复
        if(historyData.indexOf(search) != -1){
            //重复就删除以前的数据
            historyData.splice(historyData.indexOf(search),1);
        }
        //添加数据到本地存储数据的前面
        historyData.unshift(search);
        //将更新的数据转为json字符串保存到本地存储中
        localStorage.setItem('searchHistory',JSON.stringify(historyData));
        //渲染页面
        getHistory();
        //跳转并将搜索的内容提交到目标页面
        location = 'productList.html?search='+search;
    });
    //首次进入,渲染页面
    getHistory();
    //获取本地存储内容并用模版引擎渲染到页面上
    function getHistory(){
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        var html = template('searchHistoryTpl',{list:historyData});
        $('.mui-card-content .mui-table-view').html(html);
    }
    //删除图标的点击事件
    $('.mui-card-content .mui-table-view').on('tap','.btn-delete',function(){
        //获取自定义的索引
        var index = $(this).data('index');
        //获取本地存储的数据
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 删除所选索引的内容
        historyData.splice(index,1);
        //将更新的数据转为json字符串保存到本地存储中
        localStorage.setItem('searchHistory', JSON.stringify(historyData));
        //渲染页面
        getHistory();
    });
    //清空所有的点击事件
    $('.btn-clear').on('tap',function(){
        //移出本地存储的数组或对象
        localStorage.removeItem('searchHistory');
        // 渲染页面
        getHistory();
    })
    //历史记录内容的点击事件
    $('.mui-table-view-cell').on('tap',function(){
        //点击内容,将当前的内容文本添加到搜索框内
        $('.input-search').val($(this).children('span').text());
    })
})