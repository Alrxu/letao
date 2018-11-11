$(function () {
    var letao_search=new LTao_search();
    // 搜索
    letao_search.realizeSearch();
    // 显示历史记录
    letao_search.RenderHistory();
    // 单条删除历史记录
    letao_search.deleteOnceHist();
    // 清空历史记录
    letao_search.clearHistory();
})

var LTao_search=function () {  };
LTao_search.prototype={
    // 搜索
    realizeSearch: function () {
        var that=this;
        // 点击搜索按钮,获取文本框中的内容
        $("#main .btn-search").on("tap",function () {
            var search = $('#main .search_txt').val();
             // console.log(search);
             if(!search){
                //如果没有搜索内容
                return false;
            }
            // 如果本地存储中有数组,就将输入框中的内容从前面添加进数组,否则就创建一个数组
            var localData =localStorage.getItem('localHistory');
            if(localData){
                localData=JSON.parse(localData);
            }else {
                var localData=[];
            }

            if(localData.indexOf(search)!=-1){
                //又重复的数据,就删除之前的数据,添加新数据
                localData.splice(localData.indexOf(search),1);
                localData.unshift(search);
            }else {
                localData.unshift(search);
            }
            
            localData=JSON.stringify(localData);
            localStorage.setItem('localHistory',localData);
            console.log(localData);
            // 文本框中的数据存储到本地之后,将历史记录渲染到页面上
            that.RenderHistory();
           //清空搜索框
           $('#main .search_txt').val('');
           location.href="../m/productlist.html?search="+search;
        })
    },
    RenderHistory: function () {
        var localData=JSON.parse(localStorage.getItem('localHistory'))||[];
        var html=template('RenderHis-tpl',{list:localData});
        $('#main ul').html(html);
    },

    deleteOnceHist:function () {
        var that=this;
        $('#main ul').on("tap",".fa-close",function () {
            var localData =JSON.parse(localStorage.getItem('localHistory'))||[];
            localData.splice($(this).parent().data('index'),1);
            // console.log(localData);
            localData=JSON.stringify(localData);
            localStorage.setItem('localHistory',localData);
            that.RenderHistory();
        })
    },

    clearHistory: function () {
        var that=this;
        $('#main .clearall').on('tap',function () {
            localStorage.removeItem('localHistory');
            that.RenderHistory();
        })
       
    }
}