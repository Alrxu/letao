$(function () {
    var letao_index = new LTao_index();
    // 初始化轮播图插件
    letao_index.initSilder();
    //初始化内容滚动
    letao_index.initScroll();


})

var LTao_index = function () {}
LTao_index.prototype = {
    initSilder: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },

    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }
}