$(function () {
    var letao_user = new LTao_user();
    // 渲染用户信息
    letao_user.renderUser();
    // 退出登录
    letao_user.logout();
})

var LTao_user = function () {  };
LTao_user.prototype = {
    // 渲染用户信息
     renderUser: function(){
         $.ajax({
             url: '/user/queryUserMessage',
             success: function (data) {
                 console.log(data);
                 if(data.error){
                     location.href="../m/login.html?returnUrl=user.html";
                 }else {
                    $('.username').html(data.username);
                    $('.mobile').html(data.mobile);
                 }
             }
         })
     },

     // 退出登录
     logout:function () {
        $('.logout').on('tap',function () {
            $.ajax({
                url: '/user/logout',
                success: function (data) {
                    if(data.error){
                        location.href="../m/login.html?returnUrl=user.html";
                    }else {
                        location.href="../m/login.html?returnUrl=index.html";
                    }
                }
            })
        })
     }

}