$(function () {
    var letao_detail = new LTtao_detail();
    letao_detail.id = letao_detail.getAddressURLParam('id');
    letao_detail.initSilder();
    // 初始化内容滚动
    letao_detail.initScroll();
    // 数字框的初始化
    letao_detail.initNum();
    // 渲染商品详情页面
    letao_detail.renderDetail();
    // 加入购物车
    letao_detail.addProcar();
})

var LTtao_detail = function () {}
LTtao_detail.prototype = {
    id: '',
    // 轮播图
    initSilder: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    // 初始化内容滚动
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },

    // 数字框的初始化
    initNum: function () {
        mui('.mui-numbox').numbox();
    },

    // 渲染商品详情页面
    renderDetail: function () {
        var that = this;
        $.ajax({
            url: "/product/queryProductDetail",
            data: {
                id: this.id
            },
            success: function (data) {
                console.log(data);
                // 1. 渲染轮播图
                var html = template('slider-tpl', data);
                $('#slider .mui-slider').html(html);
                // 动态添加轮播图之后 ,重新初始化
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
                });

                // 2. 渲染商品详情
                // 尺码格式为xx-xx 要转换为数组格式
                var startsize = data.size.split('-')[0];
                var endsize = data.size.split('-')[1];
                var arr = [];
                for (var i = startsize; i <= endsize; i++) {
                    //  转换为数字类型
                    arr.push(parseInt(i));
                }
                // 将data.size重新赋值
                data.size = arr;
                var html = template('proMessage-tpl', data);
                $('#proMessage').html(html);

                //动态添加数字框数据之后,要手动再初始化
                that.initNum();

                // 3. 当前被点击的尺码背景色改变
                $("#proMessage .right").on('tap', '.poncesize', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                })
            }
        })
    },


    //  加入购物车
    addProcar: function () {
        var that = this;
        // 点击加入购物车,判断
        // 如果尺码没选择,提示
        // 如果数量没选择,提示
        $('#footer .joinProcar').on('tap', function () {
            // 获取尺码
            var size = $('#proMessage .right .active').data('size');
            // console.log(size);
            // 获取数量
            var num = mui('.mui-numbox').numbox().getValue();
            // console.log(num);
            if (!size) {
                mui.toast('请选择尺码', {
                    duration: 'short'
                });
            } else if (!num) {
                mui.toast('请选择数量', {
                    duration: 'short'
                });
            } else {
                // 提示是否要查看购物车
                mui.confirm("添加成功! 是否要查看购物车", "温馨提示", ['是', '否'], function (e) {
                    // console.log(e);
                   if(e.index == 0){
                    // 如果尺码和数量都选择了,发送请求提交
                    $.ajax({
                        url: "/cart/addCart",
                        type: "post",
                        data: {
                            productId: that.id,
                            num: num,
                            size: size,
                        },
                        success: function (data) {
                            // console.log(data);
                            if (data.error) {
                                // 如果响应体有error,说明没有登录,回到登录页面
                                location.href = "../m/login.html?returnUrl=detail.html?id="+that.id;
                            } else {
                                location.href = "../m/cart.html"
                            }

                        }
                    })
                }else {
                    mui.toast('请继续添加', {
                        duration: 'short'
                    });
                }
            })
            }



        })
    },


    // 截取地址栏的字符串
    getAddressURLParam: function (search) {
        //构造一个含有目标参数的正则表达式的对象
        var reg = new RegExp("(^|&)" + search + "=([^&]*)(&|$)");
        //匹配目标参数
        var url = window.location.search.substr(1).match(reg);
        //返回参数值
        if (url != null)
            return decodeURI(url[2]);
        return null;
    },

}