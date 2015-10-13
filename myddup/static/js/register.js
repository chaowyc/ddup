//一个汉字(中文标点)占2个字符、一个标点符号占1个字符、一个英文字母占1个字符
//初始化
$(function(){
    $(':input').each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea'){
            this.value = "";
        }else if (type == 'checkbox' || type == 'radio'){
            this.checked = false;
        }else if (tag == 'select'){
             this.selectedIndex = -1;
        }
         
      });
    
    $(':input').blur(function(){
        /*
         * 为表单添加一个失去焦点、获得焦点等的事件(具体见《锋利的jQuery II》)
         * auther:BeginMan
         * date：2013/11/5
         */
        var $parent = $(this).parent();
        $parent.find('.err,.ok').remove();                    //删除以前的提醒元素
        
        if($(this).is('#username')){                        //验证用户名
            var us = del_blank(this.value);
            if(us != ""){
                var nick2 = us.replace(/[\u4e00-\u9fa5]/g, 'aa');
                if(regCheck(1).test(nick2)){            
                    //用户校验
                    $parent.append('<span class="us_check"></span>');
                    $.post('/account/register_check/',{'username':us,'type':1},function(data){
                        if(data=='ok'){
                            //用户名可以注册
                            $parent.find('.err,.ok,.us_check').remove();                    //删除以前的提醒元素
                            $parent.append('<span class="ok"></span>');
                        }else if(data=='err'){
                            //用户名存在
                            $parent.find('.err,.ok').remove();                    //删除以前的提醒元素
                            var errorMsg = '该用户名已存在，请选择其他用户名';
                            $parent.append('<span class="err">'+errorMsg+'</span>');
                        }else{
                            //其他
                        }
                    })
                }else{
                    var errorMsg = '用户名格式不对，请输入中文、字母、数字或下划线组成的用户名';
                    $parent.append('<span class="err">'+errorMsg+'</span>');
                }
            }else{
                var errorMsg = '请输入4-16位的用户名';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#password1')){                    //验证密码1        
            var pwd1 = del_blank(this.value);
            if(pwd1 != ""&&(regCheck(2).test(pwd1))){
                //校验成功
                $parent.append('<span class="ok"></span>');
                
            }else{
                //校验失败
                var errorMsg = '请输入正确格式的密码';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#password2')){                    //验证密码2
            var pwd2 = del_blank(this.value);
            if(pwd2 != ""&&(regCheck(2).test(pwd2))){
                //是否相同
                if($('#password1').val()!=''){
                    pwd1 = $('#password1').val();
                    if(pwd2!=pwd1){
                        var errorMsg = '两次输入结果不一样';
                        $parent.append('<span class="err">'+errorMsg+'</span>');
                    }else{
                        //校验成功
                        $parent.append('<span class="ok"></span>');
                    }
                }
                
                
            }else{
                //校验失败
                var errorMsg = '请输入正确格式的密码';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#email')){                        //邮箱验证
            var email = del_blank(this.value);
            if(email!=''&&(regCheck(3).test(email))){
                $parent.append('<span class="us_check"></span>');
                $.post('/account/register_check/',{'email':email,'type':2},function(data){
                    if(data=='ok'){
                        //该邮箱可以注册
                        $parent.find('.err,.ok,.us_check').remove();                    //删除以前的提醒元素
                        $parent.append('<span class="ok"></span>');
                    }else if(data=='err'){
                        //该邮箱已存在
                        $parent.find('.err,.ok').remove();                    //删除以前的提醒元素
                        var errorMsg = '该邮箱已被注册，请登录或选择其他邮箱';
                        $parent.append('<span class="err">'+errorMsg+'</span>');
                    }else{
                        //其他
                    }
                })
            }else{
                //校验失败
                var errorMsg = '请输入正确格式的邮箱';
                $parent.append('<span class="err">'+errorMsg+'</span>');
                
            }
        }else if($(this).is('#agreement')){                    //协议勾选
            if($(this).attr('checked')){
                $parent.append('<span class="ok"></span>');
            }else{
                var errorMsg = '勾选协议才能注册';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#v_code')){                    //验证码
            var code = del_blank(this.value);
            if(code == ''){
                //校验失败
                var errorMsg = '请输入验证码';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
            
        }
    }).keyup(function(){
        if($(this).is('#username')||$(this).is('#email')){
            //不动
        }else{
            $(this).triggerHandler('blur');
        }
        
    }).focus(function(){
        if($(this).is('#username')||$(this).is('#email')){
            //不动
        }else{
            $(this).triggerHandler('blur');
        }
    })

    
    $('#form').submit(function() {
        /*
         * 注册提交数据
         * auther:BeginMan
         * date:2013/11/11
         */

        if($('#button').attr('class') == 'btn-submit disabled'){
            return false;
        }
        var numError = $('.err').length;
        if(numError||!$('#agreement').attr('checked')){
            shake($(".err"),"red",3);
            return false;
        }
        $(':input').each(function(){
            if(del_blank(this.value) == ''){
                return false;
            }
        })
        
        //提交数据
        $.post('/account/do_register/',$('#form').serialize(),function(data){
            var result = eval ("(" + data + ")");  
            if(result.ok == 'ok'){
                return art.dialog({content: '恭喜你，注册成功',title:'注册信息反馈:',icon: 'succeed',ok:function(){location.href='/'}});
            }else{
                return art.dialog({content: ''+result.err+'',title:'注册信息反馈:',icon: 'error',ok:function(){}});
            }
        })
        return false;
      });
    
    $('#agreement').click(function(){
        /*
         * 勾选协议效果
         * auther:BeginMan
         * date:213/11/10
         */
    
        if($(this).attr('checked')){
                $('#button').attr('class','btn-submit enabled');
        }else{
            $('#button').attr('class','btn-submit disabled');
        }
    })

})



function regCheck(type){
    /*
     * 正则表达式匹配
     * auther:BeginMan
     * date:2013/11/4
     */
    var reg = '';
    if(type == 1){                    //用户名校验
        reg = /^[a-z0-9_\-]{2,20}$/ig
    }else if(type == 2){            //密码校验
        reg = /^[a-z0-9_-]{6,18}$/;
    }else if(type == 3){            //邮箱验证
        reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;        
    }
    
    return reg;
}



$('#form').keypress(function(e){
    /*
     * 在表单禁用回车键
     */
    if(e.which == 13){
        return false;
    }
})

function clearForm(form) {
    /*
     * 清除所有表单数据
     */
  $(':input', form).each(function() {
    var type = this.type;
    var tag = this.tagName.toLowerCase();         
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = "";
    
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    
    else if (tag == 'select')
      this.selectedIndex = -1;
  });
};