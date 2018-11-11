$(function () {
    var letao_productlist = new LTao_producelist();
    letao_productlist.search = letao_productlist.getAddressURLParam('search');
    // 实现搜索渲染出搜索商品
    letao_productlist.renderProduce(function (data) {
        var html = template('productlist-tpl', data);
        $('#main .cont-pro .mui-row').html(html);
    })

    // 截取地址栏的字符串
    letao_productlist.getAddressURLParam();
    // 渲染商品列表
    letao_productlist.renderProduce();
    // 上拉刷新和下拉加载
    letao_productlist.pullrefresh();
    // 搜索商品
    letao_productlist.searchPro();
    // 排序商品
    letao_productlist.sortPro();
    // 点击跳转到商品详情页
    letao_productlist.skipDetail();
})

var LTao_producelist = function () {};
LTao_producelist.prototype = {
    page: 1,
    pageSize: 2,
    search: '',
    price: '',
    num: '',
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

    // 渲染商品列表
    renderProduce: function (callback) {
        // 发送请求
        $.ajax({
            url: "/product/queryProduct",
            data: {
                "proName": this.search,
                "page": this.page,
                "pageSize": this.pageSize,
                "price": this.price,
                "num": this.num,
            },
            success: function (data) {
                console.log(data);
                // 利用数据可能是给html或者给appendChild
                // 所用用回调函数  
                // 声明函数并且调用传参
                callback && callback(data);
            }
        })
    },

    // 上拉刷新和下拉加载
    pullrefresh: function () {
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

        // 下拉刷新的回调函数
        function pulldownRefresh() {
            setTimeout(function () {
                //每次下拉刷新都需要重置page,因为要实现每次下拉刷新都是page为1的页面
                that.page = 1;
                // 请求数据
                that.renderProduce(function (data) {
                    var html = template('productlist-tpl', data);
                    $('#main .cont-pro .mui-row').html(html);
                })
                // 请求完数据之后,结束下拉刷新
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                // 重置上拉加载,当没有数据加载时,无法再重新上拉加载数据,需要重置上拉
                mui('#pullrefresh').pullRefresh().refresh(true);
            }, 1000);
        };


        // 上拉加载回调函数
        function pullupRefresh() {
            setTimeout(function () {
                // 上拉加载,添加商品数据,
                that.page++;
                that.renderProduce(function (data) {
                    // 需要进行判断,如果有数据则添加,没有数据则提示没有数据
                    if (data.data.length > 0) {
                        var html = template('productlist-tpl', data);
                        $('#main .cont-pro .mui-row').append(html);
                        // 请求完数据之后,结束上拉加载
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    } else {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }
                })

            }, 1000)
        }
    },


    // 搜索商品
    searchPro: function () {
        var that = this;
        // 为了避免上拉加载和下拉刷新的page改变会影响搜索
        //需要重置page
        that.page = 1;
        $('#search .btn-search').on('tap', function () {
            that.search = $('#search .search_txt').val();
            that.renderProduce(function (data) {
                var html = template('productlist-tpl', data);
                $('#main .cont-pro .mui-row').html(html);
            })
            $('#search .search_txt').val("");
        })


    },


    // 商品排序
    sortPro: function () {
        var that = this;
        // price 价格 1 升序   2 降序
        // num 销量 1 升序   2 降序
        // 根据点击的自定义属性取出是什么排序方式,排序顺序
        // 给data-sort-type 排序方式
        // data-sort 排序顺序
        // price和num不能同时
        $('#nav .mui-row a').on('tap', function () {
            var sortType = $(this).data('sort-type');
            var sort = $(this).data('sort');
            sort = sort == 1 ? 2 : 1;
            $(this).data('sort', sort);
            // console.log(sort);
            if (sortType == "price") {
                that.price = sort;
                that.num = '';
            } else {
                that.price = '';
                that.num = sort;
            }
            that.renderProduce(function (data) {
                var html = template('productlist-tpl', data);
                $('#main .cont-pro .mui-row').html(html);
            })
        })
    },

    // 点击立即购买 跳转到商品详情页
    skipDetail: function () {
        $('.cont-pro').on("tap",".buy",function () {
            location.href="../m/detail.html?id="+$(this).data('id');
        })
    }


    


}