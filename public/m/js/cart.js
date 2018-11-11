$(function () {
    var letao_cart = new LTao_cart();
    // 渲染购物车商品列表
    letao_cart.renderCartPro();
    // 初始化上拉加载和下拉刷新
    letao_cart.initRefresh();
    //初始化左滑显示按钮
    letao_cart.initSliderLeft();
    // 计算总金额
    letao_cart.CumulativeMon();

    letao_cart.renderCartPro(function (data) {
        var html = template('cartpro-tpl', data);
        $('#main ul').html(html);
    })

})

var LTao_cart = function () {};
LTao_cart.prototype = {
    page: 1,
    pageSize: 5,
    renderCartPro: function (callback) {
        $.ajax({
            url: "/cart/queryCartPaging",
            data: {
                page: this.page,
                pageSize: this.pageSize,
            },
            success: function (data) {
                // console.log(data);
                //判断: 如果没有登录就回到登录页面,先将登陆成功之后要跳转的地址作为参数告诉登录页面
               // 这样登录成功之后就会跳转回指定的页面,而不会因为这个页面没有完全渲染完,就不是登录页面的上一页
                if (data.error) {
                    location.href = "../m/login.html?returnUrl=cart.html";
                } else { //,登录了就渲染页面
                    // 当没有数据的时候,响应体是一个空数组,需要处理
                    if (data instanceof Array) {
                        data = {
                            data: data
                        };
                    }
                    callback && callback(data);
                }

            }
        })
    },

    // 初始化上拉加载和下拉刷新
    initRefresh: function () {
        var that = this;
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });

        // 下拉刷新回调函数
        function pulldownRefresh() {
            setTimeout(function () {
                // 下拉刷新, page重置
                that.page = 1;
                // 重新渲染页面
                that.renderCartPro(function (data) {
                    var html = template('cartpro-tpl', data);
                    $('#main ul').html(html);
                    // 请求完数据之后,结束下拉刷新
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    // 重置上拉加载,当没有数据加载时,无法再重新上拉加载数据,需要重置上拉
                    mui('#pullrefresh').pullRefresh().refresh(true);
                })
            }, 1000)
        }


        // 上拉加载回调函数
        function pullupRefresh() {
            setTimeout(function () {
                // 上拉加载 page++  且数据append
                that.page++;
                that.renderCartPro(function (data) {
                    // 当没有数据时,整个响应体就是一个空数组
                    console.log(data);
                    //所以要当响应体data不是数组时,就说明有数据,
                    //因为在公共函数中把data处理过了,就可以直接写data.data.length
                    if (data.data.length > 0) {
                        var html = template('cartpro-tpl', data);
                        $('#main ul').append(html);
                        // 请求完数据之后,结束上拉加载
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    } else {
                        // 重置上拉加载,当没有数据加载时,无法再重新上拉加载数据,需要重置上拉
                        // 并且提示没有数据了
                        //结束上拉加载 并且提示没有更多数据
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }
                })
            }, 1000)
        }
    },


    // 初始化左滑显示删除和编辑按钮
    initSliderLeft: function () {
        var that = this;
        var btnArray = ['确认', '取消'];
        // 1.实现删除功能
        $('.mui-table-view').on('tap', '.btn-delete', function () {
            var li = this.parentNode.parentNode;
            // 获取到该商品的id
            var id = $(this).parent().parent().data('id');
            // console.log(id);

            mui.confirm('确认删除该商品？', '温馨提示', btnArray, function (e) {
                if (e.index == 0) {
                    // 点击确定,发送请求删除该id的商品
                    $.ajax({
                        url: "/cart/deleteCart",
                        data: {
                            id: id,
                        },
                        success: function (obj) {
                            console.log(obj);
                            if (obj.success) {
                                mui.toast('删除成功!', {
                                    duration: 'long'
                                })
                                that.page = 1;
                                // 如果删除成功,重新渲染页面
                                that.renderCartPro(function (data) {
                                    var html = template('cartpro-tpl', data);
                                    $('#main ul').html(html);
                                    //还要重置上拉加载的效果 要放到请求完毕数据渲染完毕才重置
                                    mui('#pullrefresh').pullRefresh().refresh(true);
                                })
                            }
                        }
                    })
                } else {
                    setTimeout(function () {
                        // 左滑还原
                        mui.swipeoutClose(li);
                    }, 0);
                }
            });
        });

        // 2. 实现编辑功能
        $('.mui-table-view').on('tap', '.btn-edit', function () {
            var li = this.parentNode.parentNode;
            // 将所点击的商品的全部信息存储在编辑按钮的自定义属性中
            // 取出尺码和数量
            var product = $(this).data('product');
            console.log(product);
            var start = product.productSize.split('-')[0];
            var end = product.productSize.split('-')[1];
            var arr = [];
            for (var i = start; i <= end; i++) {
                arr.push(parseInt(i));
            }
            product.productSize = arr;
            var html = template('editpro-tpl', product);
            // html换行了,要清除回车换行
            html = html.replace(/[\r\n]/g, "");
            mui.confirm(html, "编辑商品", ["确定", "取消"], function (e) {
                if (e.index == 0) {
                    // 如果点击确定,获取尺码和数量
                    var size = $('.active').data('size');
                    var num = mui(".mui-numbox").numbox().getValue();
                    $.ajax({
                        url: '/cart/updateCart',
                        data: {
                            id: product.id,
                            size: size,
                            num: num,
                        },
                        type: "post",
                        success: function (data) {
                            console.log(data);
                            if (data.success) {
                                that.page = 1;
                                // 修改成功,重新渲染页面
                                that.renderCartPro(function (data) {
                                    var html = template('cartpro-tpl', data);
                                    $('#main ul').html(html);
                                })
                            }
                        }
                    })


                } else {
                    setTimeout(function () {
                        // 左滑还原
                        mui.swipeoutClose(li);
                    }, 0);
                }
            })
            // 尺码和数量渲染上去之后,需要点击选择尺码 以及 初始化数字框
            $(".prosize .right").on('tap', '.poncesize', function () {
                $(this).addClass('active').siblings().removeClass('active');
            })
            mui('.mui-numbox').numbox();


        })
    },


    // 计算总金额
    CumulativeMon: function () {
        var total = 0;
        // 值改变事件
        $('.mui-table-view').on('change', 'input', function () {
            var checkbox = $('input[type="checkbox"]:checked');
            checkbox.each(function (index, ele) {
                var unitprice = $(ele).data('price');
                var num = $(ele).data('num');
                var sum = unitprice * num;
                total = total*1 + sum*1;
                console.log(total);
                
            })
            //toFixed只能针对数字类型才能使用  所以要用parseFloat或者parseInt转换一下
            total = parseFloat(total).toFixed(2);
            $('#totalNum .totalMon').html(total);

        })
    },
}