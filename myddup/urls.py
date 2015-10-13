
from django.conf.urls.defaults import *
from models import *
from views import *

urlpatterns = patterns('',

    (r'schedule/create/$', create_schedule),
    (r'schedule/list/$', list_schedule ),
    (r'schedule/edit/(?P<id>[^/]+)/$', edit_schedule),
    (r'schedule/view/(?P<id>[^/]+)/$', view_schedule),
    
)
