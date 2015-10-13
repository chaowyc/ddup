//һ������(���ı��)ռ2���ַ���һ��������ռ1���ַ���һ��Ӣ����ĸռ1���ַ�
//��ʼ��
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
         * Ϊ�����һ��ʧȥ���㡢��ý���ȵ��¼�(�������������jQuery II��)
         * auther:BeginMan
         * date��2013/11/5
         */
        var $parent = $(this).parent();
        $parent.find('.err,.ok').remove();                    //ɾ����ǰ������Ԫ��
        
        if($(this).is('#username')){                        //��֤�û���
            var us = del_blank(this.value);
            if(us != ""){
                var nick2 = us.replace(/[\u4e00-\u9fa5]/g, 'aa');
                if(regCheck(1).test(nick2)){            
                    //�û�У��
                    $parent.append('<span class="us_check"></span>');
                    $.post('/account/register_check/',{'username':us,'type':1},function(data){
                        if(data=='ok'){
                            //�û�������ע��
                            $parent.find('.err,.ok,.us_check').remove();                    //ɾ����ǰ������Ԫ��
                            $parent.append('<span class="ok"></span>');
                        }else if(data=='err'){
                            //�û�������
                            $parent.find('.err,.ok').remove();                    //ɾ����ǰ������Ԫ��
                            var errorMsg = '���û����Ѵ��ڣ���ѡ�������û���';
                            $parent.append('<span class="err">'+errorMsg+'</span>');
                        }else{
                            //����
                        }
                    })
                }else{
                    var errorMsg = '�û�����ʽ���ԣ����������ġ���ĸ�����ֻ��»�����ɵ��û���';
                    $parent.append('<span class="err">'+errorMsg+'</span>');
                }
            }else{
                var errorMsg = '������4-16λ���û���';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#password1')){                    //��֤����1        
            var pwd1 = del_blank(this.value);
            if(pwd1 != ""&&(regCheck(2).test(pwd1))){
                //У��ɹ�
                $parent.append('<span class="ok"></span>');
                
            }else{
                //У��ʧ��
                var errorMsg = '��������ȷ��ʽ������';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#password2')){                    //��֤����2
            var pwd2 = del_blank(this.value);
            if(pwd2 != ""&&(regCheck(2).test(pwd2))){
                //�Ƿ���ͬ
                if($('#password1').val()!=''){
                    pwd1 = $('#password1').val();
                    if(pwd2!=pwd1){
                        var errorMsg = '������������һ��';
                        $parent.append('<span class="err">'+errorMsg+'</span>');
                    }else{
                        //У��ɹ�
                        $parent.append('<span class="ok"></span>');
                    }
                }
                
                
            }else{
                //У��ʧ��
                var errorMsg = '��������ȷ��ʽ������';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#email')){                        //������֤
            var email = del_blank(this.value);
            if(email!=''&&(regCheck(3).test(email))){
                $parent.append('<span class="us_check"></span>');
                $.post('/account/register_check/',{'email':email,'type':2},function(data){
                    if(data=='ok'){
                        //���������ע��
                        $parent.find('.err,.ok,.us_check').remove();                    //ɾ����ǰ������Ԫ��
                        $parent.append('<span class="ok"></span>');
                    }else if(data=='err'){
                        //�������Ѵ���
                        $parent.find('.err,.ok').remove();                    //ɾ����ǰ������Ԫ��
                        var errorMsg = '�������ѱ�ע�ᣬ���¼��ѡ����������';
                        $parent.append('<span class="err">'+errorMsg+'</span>');
                    }else{
                        //����
                    }
                })
            }else{
                //У��ʧ��
                var errorMsg = '��������ȷ��ʽ������';
                $parent.append('<span class="err">'+errorMsg+'</span>');
                
            }
        }else if($(this).is('#agreement')){                    //Э�鹴ѡ
            if($(this).attr('checked')){
                $parent.append('<span class="ok"></span>');
            }else{
                var errorMsg = '��ѡЭ�����ע��';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
        }else if($(this).is('#v_code')){                    //��֤��
            var code = del_blank(this.value);
            if(code == ''){
                //У��ʧ��
                var errorMsg = '��������֤��';
                $parent.append('<span class="err">'+errorMsg+'</span>');
            }
            
        }
    }).keyup(function(){
        if($(this).is('#username')||$(this).is('#email')){
            //����
        }else{
            $(this).triggerHandler('blur');
        }
        
    }).focus(function(){
        if($(this).is('#username')||$(this).is('#email')){
            //����
        }else{
            $(this).triggerHandler('blur');
        }
    })

    
    $('#form').submit(function() {
        /*
         * ע���ύ����
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
        
        //�ύ����
        $.post('/account/do_register/',$('#form').serialize(),function(data){
            var result = eval ("(" + data + ")");  
            if(result.ok == 'ok'){
                return art.dialog({content: '��ϲ�㣬ע��ɹ�',title:'ע����Ϣ����:',icon: 'succeed',ok:function(){location.href='/'}});
            }else{
                return art.dialog({content: ''+result.err+'',title:'ע����Ϣ����:',icon: 'error',ok:function(){}});
            }
        })
        return false;
      });
    
    $('#agreement').click(function(){
        /*
         * ��ѡЭ��Ч��
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
     * ������ʽƥ��
     * auther:BeginMan
     * date:2013/11/4
     */
    var reg = '';
    if(type == 1){                    //�û���У��
        reg = /^[a-z0-9_\-]{2,20}$/ig
    }else if(type == 2){            //����У��
        reg = /^[a-z0-9_-]{6,18}$/;
    }else if(type == 3){            //������֤
        reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;        
    }
    
    return reg;
}



$('#form').keypress(function(e){
    /*
     * �ڱ����ûس���
     */
    if(e.which == 13){
        return false;
    }
})

function clearForm(form) {
    /*
     * ������б�����
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