$(function () {
    var letao = new Letao();
    // 渲染用户页面
    letao.queryTopCategory();
    // 分页插件的初始化
    letao.paginator();
    // 添加分类
    letao.addTopCategory();
    // 退出操作
    letao.logout();
})
var Letao = function () {};
Letao.prototype = {
    page: 1,
    pageSize: 5,
    totalPages: '',
    // 渲染页面
    queryTopCategory: function () {
        var that = this;
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: {
                page: this.page,
                pageSize: this.pageSize,
            },
            success: function (data) {
                console.log(data);
                var html = template('topCategory-tpl', data);
                $('.main-right .table tbody').html(html);
                that.totalPages = Math.ceil(data.total / that.pageSize);
                // 调用分页初始化
                that.paginator(that.totalPages);
            }
        })
    },
    // 分页插件的初始化
    paginator: function (totalPages) {
        var that = this;
        // totalPages  需要计算 = 总数据/pageSize(每页多少条)
        // 总数据只有渲染用户页面时才拿到数据,所以就让totalPages 为参数传过来
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: that.page, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                // page为当前点击的页码
                that.page = page;
                // 重新渲染用户页面
                that.renderUser();
            }
        });
    },

    // 添加分类
    addTopCategory: function () {
        var that = this;
        // 点击保存,发送请求
        $('.btn-save').on('click',function () {
            // 获取文本框中输入的值
            var categoryName = $('.categoryName').val();
            if(!categoryName.trim()) {
                alert('请输入分类名称');
                return false;
            }
            $.ajax({
                url: '/category/addTopCategory',
                data: {
                    categoryName: categoryName,
                },
                type: 'post',
                success: function (data) {
                    if(data.success) {
                        that.queryTopCategory();
                    }else{
                        alert('添加失败!');
                    }
                }
            })

            
        })
    },

    // 退出操作
    logout: function () {
        // 点击退出按钮,发送请求退出
        $('.exit').on('click',function () {
            $.ajax({
                url:'/employee/employeeLogout',
                success: function (data) {
                    // console.log(data);
                    // 如果success就跳转到登录页面
                    if(data.success) {
                        location.href="../admin/index.html";
                    }else{
                        alert('退出失败!');
                    }
                }
            })
        })
    },
}