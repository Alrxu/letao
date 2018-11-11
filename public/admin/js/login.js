$(function(){
    var letao = new Letao();
    // 登录
    letao.loginCon();
})

var Letao = function(){ };
Letao.prototype = {
    // 登录
    loginCon: function () {
      // 点击登录发送请求
      $('.btn-login').on('click',function () {
       var username = $('.username').val();
       var password = $('.password').val();
       if(!username.trim()){
           alert("请输入用户名!")
           return false;
       }
       if(!password.trim()){
        alert("请输入密码!")
        return false;
       }
        $.ajax({
            url: '/employee/employeeLogin',
            type: "post",
            data: {
                username: $('.username').val(),
                password: $('.password').val(),
            },
            success: function(data){
                console.log(data);
                if(data.success){
                    location.href="../admin/index.html";
                }
            }
        })
      })
    }
}
