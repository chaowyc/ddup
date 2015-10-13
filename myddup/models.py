# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
            
            
class Schedule(models.Model):
    user = models.ForeignKey(User)
    time = models.DateTimeField(auto_now = True)
    time1 = models.CharField(max_length=30)
    time2 = models.CharField(max_length=30)
    do = models.CharField(max_length=100)
    adress = models.CharField(max_length=100)
    people = models.CharField(max_length=100)
    yesorno = models.BooleanField(default=False)
    
    