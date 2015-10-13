# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url

from myddup.models import *
from myddup.views import *
from django.contrib.auth.views import login, logout
from django.contrib import admin
admin.autodiscover()



urlpatterns = patterns('',
    url(r'^$', list_schedule),            #黄亮的工作
    url(r'^flag/$', flag_schedule),
    url(r'^delete/$', delete_schedule),
    url(r'^search/$', search_schedule),
    url(r'^create/$', create_schedule),
    url(r'^edit/$', edit_schedule),     
    url(r'^change/$', chpwd),
    url(r'^data_count/$', data_count),   #王玺羽和李子勃的工作
    url(r'^adress_count/$', adress_count),
    url(r'^do_count/$', do_count),
    url(r'^trand_pie/$', trand_pie),
    url(r'^trand_bar/$', trand_bar),
    url(r'^trand_line/$', trand_line),
    url(r'^sent/$', sent),               #我的工作
    url(r'^accounts/login/$', login),
    url(r'^accounts/logout/$', logout),
    url(r'^accounts/changepassword/$', chpwd),
    url(r'^accounts/register/$', reg),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^senttest/', senttest),
)
