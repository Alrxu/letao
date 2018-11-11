$(function () {
    var letao = new Letao();
    // 渲染用户页面
    letao.renderUser();
    // 分页插件的初始化
    letao.paginator();
    // 修改用户状态
    letao.updateUser();
    // 退出操作
    letao.logout();
})
var Letao = function () {};
Letao.prototype = {
    page: 1,
    pageSize: 5,
    totalPages: '',
    // 渲染用户页面
    renderUser: function () {
        var that = this;
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: this.page,
                pageSize: this.pageSize,
            },
            success: function (data) {
                console.log(data);
                var html = template('queryUser-tpl', data);
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

    // 禁用或启用功能 修改用户状态
    updateUser: function () {
        var that = this;
        // 点击按钮 发送请求,传参数,将参数放到自定义属性中
        $('.main-right .table tbody').on('click', '.btn-query', function () {
            // 获取到id和isDelete
            var id = $(this).data('id');
            var isDelete = $(this).data('is-delete');
            // isDelete还要重置
            isDelete = isDelete == 1 ? 0 : 1;
            $.ajax({
                url: '/user/updateUser',
                data: {
                    id: id,
                    isDelete: isDelete,
                },
                type: 'post',
                success: function (data) {
                    console.log(data);
                    // 如果success,就重新渲染用户页面即可
                    if (data.success) {
                        that.renderUser();
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