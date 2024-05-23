from django.contrib import admin
from django.urls import path, re_path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/file/list$', views.file_list),
    re_path(r'^api/file$', views.file_add_del),
    re_path(r'^api/file/preview/([0-9]+)$', views.file_preview),
    re_path(r'^api/file/enrich/([0-9]+)$', views.file_enrich),
]
