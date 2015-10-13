# -*- coding: utf-8 -*-
import threading, time
from django.shortcuts import render_to_response 
from django.template import Context, RequestContext
from django.http import HttpResponseRedirect
from django.core.paginator import Paginator
from django.core.paginator import PageNotAnInteger
from django.core.paginator import EmptyPage
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth import authenticate,login,logout  
from django.core.urlresolvers import reverse
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from models import *
from django.core.mail import EmailMultiAlternatives


#from settings import EMAIL_HOST_USER
 
#from_email = EMAIL_HOST_USER   
class Timer(threading.Thread):
        """
        very simple but useless timer.
        """
        def __init__(self, seconds):
                self.runTime = seconds
                threading.Thread.__init__(self)
        def run(self):
                time.sleep(self.runTime)
                print "Buzzzz!! Time's up!"

class CountDownTimer(Timer):
        """
        a timer that can counts down the seconds.
        """
        def run(self):
                counter = self.runTime
                for sec in range(self.runTime):
                        print counter
                        time.sleep(1.0)
                        counter -= 1
                print "send successful"

class CountDownExec(CountDownTimer):
        """
        a timer that execute an action at the end of the timer run.
        """
        def __init__(self, seconds, action, args=[]):
                self.args = args
                self.action = action
                CountDownTimer.__init__(self, seconds)
        def run(self):
                CountDownTimer.run(self)
                self.action(self.args)

def myAction(args=[]):
        print args
        
def sent(requset):        
        t = CountDownExec(10, myAction, ["Address", "1638072605@qq.com"])
        t.start()
        return HttpResponseRedirect('/')

def senttest(request):
    print "TRIGERED"
    subject,form_email,to = 'hello','testforproject@sina.com','2787458283@qq.com'
    text_content = 'This is an important message by the system please do not reply'
    html_content = u'<b>激活链接：</b><a href="http://www.baidu.com">http:www.baidu.com</a>'
    msg = EmailMultiAlternatives(subject,text_content,form_email,[to])
    msg.attach_alternative(html_content, 'text/html')
    msg.send()
    # send_mail('TESTFOREMAIL', 'THIS IS A TEST', 'testforproject@sina.com',
    # ['2787458283@qq.com'])
    print "SENT"
    # return render_to_response('create_schedule.html', c)
        
def Caltime(date1,date2): 
    date1=time.strptime(date1,"%Y-%m-%d %H:%M:%S")
    date2=time.strptime(date2,"%Y-%m-%d %H:%M:%S")
    date1=datetime.datetime(date1[0],date1[1],date1[2],date1[3],date1[4],date1[5])
    date2=datetime.datetime(date2[0],date2[1],date2[2],date2[3],date2[4],date2[5])
    return date2-date1
 
 
@login_required 
def flag_schedule(request):
    p = Schedule.objects.get(id=int(request.GET["id"]), user = request.user)
    if p.yesorno is False:
        p.yesorno = True
        p.save()
    return HttpResponseRedirect('/')
        
@login_required
def create_schedule(request):
    if request.user.is_authenticated():
       user = request.user
       username = user.username
       c = Context({"username": username,})
       if request.POST:
           post = request.POST
           schedule = Schedule(
           user = request.user,
           time1 = post['time1'],
           time2 = post['time2'],
           do = post["do"],
           adress = post["adress"],
           people = post["people"],
           )
           schedule.save()
    return render_to_response('create_schedule.html', c)

@login_required
def list_schedule(request):
    
    if request.user.is_authenticated():
        user = request.user
        a = 0
        username = user.username
        after_range_num = 5
        before_range_num = 6
        list_items = Schedule.objects.filter(user = request.user).order_by("time1")
        c = Context({"username": username, "count": len(list_items), })
        a = len(list_items)
        
        paginator = Paginator(list_items, 5)
        try:
            page = int(request.GET.get('page', '1'))
            if page < 1:  
                page = 1
        except ValueError:
            page = 1
        try:
            list_items = paginator.page(page)
        except PageNotAnInteger:
            list_items = paginator.page(1)
        except EmptyPage:
            list_items = paginator.page(paginator.num_pages)
        
        if page >= after_range_num:
            page_range = paginator.page_range[page-after_range_num:page+before_range_num]
        else:
            page_range = paginator.page_range[0:int(page)+before_range_num]    
            return render_to_response('list_schedule.html', c, RequestContext(request,locals()))
@login_required
def edit_schedule(request):
    if request.user.is_authenticated():
        user = request.user
        username = user.username
        c = Context({"username": username,})
        p = Schedule.objects.get(id=int(request.GET["id"]))        
        if request.POST:
            post = request.POST
            p.time1 = post["time1"]
            p.time2 = post["time2"]
            p.do = post["do"]
            p.adress = post["adress"]
            p.people = post["people"]
            p.save()
            return render_to_response("edit_schedule.html", RequestContext(request,locals()))
        else:
            return render_to_response("edit_schedule.html", Context({'p': p}), RequestContext(request,locals()))
@login_required   
def delete_schedule(request):
	dltid = request.GET["id"]
	if len(Schedule.objects.filter(id=dltid, user=request.user)) > 0:
		Schedule.objects.filter(id=dltid).delete()
		return HttpResponseRedirect("/")
	else:#防止伪造get，删除不属于自己的联系人
		c = Context({"title":"删除联系人", "message":"删除失败！此联系人不在您的联系人列表中！", "url":"/", "urltext":"点此返回" })
		return render_to_response("message.html", c)
  
@login_required 
def search_schedule(request):
    if request.user.is_authenticated():
        user = request.user
        username = user.username
        b = Context({"username": username,})
        word=" "
        if request.POST:
            word = request.POST["word"]
            p = Schedule.objects.filter(adress__icontains=word,user = request.user)
            print p
            b["result_list"] = p
            b["result_len"] = len(p)
            print len(p)
            return render_to_response("result.html", b)
        return HttpResponseRedirect("/")
 
@login_required
def chpwd(request):
    if request.user.is_authenticated() and user == request.user:
        username = user.username 
        b = Context({"username": username,})
        c = Context({})
        if request.POST:
            notsame=False
            oldwrong=False
            success=False
            old = request.POST["old"]
            new1 = request.POST["new1"]
            new2 = request.POST["new2"]
            if request.user.check_password(old):
                if new1==new2:
                    request.user.set_password(new1)
                    request.user.save()
                    success=True
                else:
                    notsame = True
            else:
                oldwrong = True
            c = Context({'notsame': notsame, 'oldwrong': oldwrong, 'success': success, })
        return render_to_response("registration/changepassword.html", locals())
def reg(request):
	"""
	当用户没有登录时，显示注册页面。
	对用户的注册信息进行检查。
	"""
	if request.user.is_authenticated():
		c = Context({"title":"错误", "message":"您已登陆！如果想要注册新用户，请先登出！", "url":"/accounts/logout/", "urltext":"点此登出" })
		return render_to_response("message.html", c)
	else:
		if request.POST:
			name = request.POST["username"]
			mail = request.POST["email"]
			pass1 = request.POST["password1"]
			pass2 = request.POST["password2"]
			
			empty = False
			namevalid = True
			passvalid = True
			success = False
			if name=="" or mail=="" or pass1=="" or pass2=="":
				empty = True
			u = User.objects.filter(username=name)
			if len(u)>0:
				namevalid = False
			if pass1 != pass2:
				passvalid = False
			if (not empty) and namevalid and passvalid:
				user = User.objects.create_user(username = name, password = pass1, email = mail)
				user.is_staff = True #使用户拥有网站的管理权限
				user.save()
				success = True
			return render_to_response("registration/reg.html",{'invalidname': not namevalid, 'invalidpass': not passvalid, 'success': success, 'empty': empty, })
		else:
			return render_to_response("registration/reg.html")
@login_required
def data_count(request):
    diff_data = []
    diff_do = []
    v_count = []
    p_count = []
    if request.user.is_authenticated():
        username = request.user.username 
        b = Context({"username": username,})
        do_count = int(Schedule.objects.count())
        
        data_list = Schedule.objects.all()
        for item in data_list:
            if item.time1 not in diff_data:
                diff_data.append(item.time1)
        for item in diff_data:
            v_count.append(Schedule.objects.filter(time1 = item, user = request.user).count())
        for i in v_count:
            p_count.append(i * 100 / do_count)
        c = Context({"data_count":diff_data,"v_count":v_count, "do_count":do_count, "p_count":p_count})
        
        return render_to_response("data_count.html",locals())
    
def adress_count(request):
    diff_ad = []
    v_count = []
    p_count = []
    if request.user.is_authenticated():
        username = request.user.username 
        b = Context({"username": username,})
        do_count = int(Schedule.objects.count())
        data_list = Schedule.objects.all().filter(user = request.user)
        for item in data_list:
            if item.adress not in diff_ad:
                diff_ad.append(item.adress)
        for item in diff_ad:
            v_count.append(Schedule.objects.filter(adress = item, user = request.user).count()) 
        for i in v_count:
            p_count.append(i * 100 / do_count)  
        c = Context({"adress_count":diff_ad,"v_count":v_count, "do_count":do_count, "p_count":p_count}) 
        return render_to_response("adress_count.html",locals())

def do_count(request):
    diff_do = []
    v_count = []
    p_count = []
    if request.user.is_authenticated():
        username = request.user.username 
        b = Context({"username": username,})
        do_count = int(Schedule.objects.count())
        data_list = Schedule.objects.all()
        for item in data_list:
            if item.adress not in diff_do:
                diff_do.append(item.adress)
        for item in diff_do:
            v_count.append(Schedule.objects.filter(adress = item, user = request.user).count()) 
        for i in v_count:
            p_count.append(i * 100 / do_count)  
        c = Context({"adress_count":diff_do,"v_count":v_count, "do_count":do_count, "p_count":p_count}) 
        return render_to_response("do_count.html",locals())

def trand_pie(request):
    if request.user.is_authenticated():
        user = request.user
        username = user.username 
        b = Context({"username": username,})
        count = int(Schedule.objects.count().filter(user = request.user))
        do_count = Schedule.objects.filter(yesorno = True, user = request.user).count()
        print count 
        print do_count
        c = Context({"count":count, "do_count":do_count,}) 
        return render_to_response("trand_pie.html",locals())
        
def trand_bar(request):
    diff_data = []
    diff_do = []
    v_count = []
    p_count = []
    if request.user.is_authenticated():
        username = request.user.username 
        b = Context({"username": username,})
        
        data_list = Schedule.objects.all()
        for item in data_list:
            if item.time1 not in diff_data:
                diff_data.append(item.time1)         
        for item in diff_data:
            v_count.append(Schedule.objects.filter(time1 = item).count())
        for item in diff_data:
            p_count.append(Schedule.objects.filter(time1 = item).exclude(yesorno = False).count())
        str_diff_data = "['"
        for d in diff_data[:-1]:
            str_diff_data += d + "', '"
        str_diff_data += diff_data[-1] + "']"
        print str_diff_data
        c = Context({"diff_data":str_diff_data, "v_count":v_count, "p_count":p_count})
        return render_to_response("trand_bar.html",locals())
        
def trand_line(request):
    diff_data = []
    diff_do = []
    v_count = []
    p_count = []
    if request.user.is_authenticated():
        username = request.user.username 
        b = Context({"username": username,})
        
        data_list = Schedule.objects.all()
        for item in data_list:
            if item.time1 not in diff_data:
                diff_data.append(item.time1)         
        for item in diff_data:
            v_count.append(Schedule.objects.filter(time1 = item).count())
        for item in diff_data:
            p_count.append(Schedule.objects.filter(time1 = item).exclude(yesorno = False).count())
        str_diff_data = "['"
        for d in diff_data[:-1]:
            str_diff_data += d + "', '"
        str_diff_data += diff_data[-1] + "']"
        print str_diff_data
        c = Context({"diff_data":str_diff_data, "v_count":v_count, "p_count":p_count})
        return render_to_response("trand_line.html",locals())

def setEmail(request):
    if request.method == "POST":
        subject,form_email,to = 'hello','testforproject@sina.com','1454744690@qq.com'
        text_content = 'This is an important message sent by the system, please do not reply'
        html_content = u'<b>激活链接：</b><a href="http://www.baidu.com">http:www.baidu.com</a>'
        msg = EmailMultiAlternatives(subject,text_content,form_email,[to])
        msg.attach_alternative(html_content, 'text/html')
        msg.send()
        print '成功'
        
