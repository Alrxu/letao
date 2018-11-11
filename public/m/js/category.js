$(function () {
    var letao_category = new LTao_category();
    //一级分类查询
    letao_category.getqueryTop();
    //二级分类查询
    letao_category.getquerySecond();
    letao_category.initScroll();
})

var LTao_category = function () {};
LTao_category.prototype = {
    getqueryTop: function () {
        $.ajax({
            url: "/category/queryTopCategory",
            type: "get",
            success: function (obj) {
                console.log(obj);

                var html = template('queryTopCategory', obj);
                $("#main ul").html(html);
            }
        })
    },
    getquerySecond: function () {
        getSecondData(1);

        function getSecondData(id) {
            $.ajax({
                url: "/category/querySecondCategory",
                type: "get",
                data: {
                    id: id
                },
                success: function (obj) {
                    console.log(obj);
                    var html = template('querySecondCategory', obj);
                    $('#main .lt-right .mui-row').html(html);
                }
            })
        }

        // 点击一级分类 委托事件,获取下标
        $('#main .lt-left ul').on("tap", 'li', function () {
            getSecondData($(this).data("index"));
            $(this).addClass("active").siblings().removeClass('active');
        })
    },
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }
}