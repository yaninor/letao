//视口变化兼容
window.addEventListener('load',function(){
    function getHtmlWidth(){
        var designWidth = 750;
        var designFontSize = 200 ;
        var nowWidth = document.documentElement.clientWidth;
        var nowFontSize = nowWidth*designFontSize/designWidth;
        document.documentElement.style.fontSize = nowFontSize + 'px';
    }
    getHtmlWidth();
    window.addEventListener('resize',getHtmlWidth);
})