$(function () {
    var letao_regist = new LTao_regist();
    // 获取验证码
    letao_regist.getVscode();
    // 注册验证
    letao_regist.registVerify();
})

var LTao_regist = function () {};
LTao_regist.prototype = {
    // 获取验证码
    getVscode: function () {
        //点击获取验证码,发送请求
        $('.getVscode').on('tap', function () {
            $.ajax({
                url: '/user/vCode',
                success: function (data) {
                    console.log(data);
                    // 验证码
                }
            })
        })
    },
    // 注册验证
    registVerify: function () {
        var check = true;
        $('.regist').on('tap', function () {
            mui(".mui-input-group input").each(function () {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.toast('请输入' + label.innerText, {
                        duration: 'long'
                    });
                    check = false;
                    return false;
                }
                if($('.truepwd').val()!=$('.password').val()){
                   alert('两个密码不一致!请重新输入')
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                // 验证通过,发送请求注册
                $.ajax({
                    url: '/user/register',
                    data: {
                        "username": $('.username').val() ,
                        "password": $('.password').val(),
                        "mobile": $('.phone').val(),
                        "vCode": $('.vscode').val(),
                    },
                    type: "post",
                    success: function (data) {
                        console.log(data);
                        if(data.error){
                            alert(data.message);
                            return false;
                        }else{
                            // 注册成功,跳转到登录页面,且让登录成功之后去到指定的页面
                            location.href="../m/login.html?returnUrl=index.html";
                        }
                    }
                })
            }
        })
    },
}