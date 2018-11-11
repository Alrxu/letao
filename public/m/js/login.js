$(function () {
    var letao_login = new LT_login();
    // 验证登录
    letao_login.contrueLogin();
    // 截取地址栏的字符串
    letao_login.getAddressURLParam();
    // 免费注册跳转
    letao_login.contrueRegist();
})

var LT_login = function () {};
LT_login.prototype = {
    // 验证登录
    contrueLogin: function () {
        var that = this;
        // 点击登录
        $('.login').on('tap', function () {
            var check = true;
            // 默认check为true
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
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                // 验证通过,发送请求提交用户名和密码
                $.ajax({
                    url: '/user/login',
                    type: "post",
                    data: {
                        username: $('.username').val(),
                        password: $('.password').val(),
                    },
                    success: function (data) {
                        // console.log(data);
                        if(data.error){
                            // 如果有error,用户名或密码错误
                            mui.toast('用户名或密码错误',{ duration:'long'});
                        }else {
                            // 登录成功,回到指定的页面
                           var returnUrl = that.getAddressURLParam('returnUrl');
                           console.log(returnUrl);
                           
                           location.href= returnUrl;
                        //    history.back();
                        }
                        
                    }
                })
            }
        })

    },

    // 点击免费注册,跳转
    contrueRegist: function () {
        $('.regist').on('tap',function () {
            location.href="../m/regist.html";
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