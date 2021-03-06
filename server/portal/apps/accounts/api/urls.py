"""
.. :module:: apps.accounts.api.urls
   :synopsis: Manager handling anything pertaining to accounts
"""
from django.conf.urls import url
from portal.apps.accounts.api.views.systems import (
    SystemsListView,
    SystemView,
    SystemTestView,
    SystemRolesView,
    SystemKeysView
)

app_name = 'portal_accounts_api'
urlpatterns = [
    url(r'^systems/list/?$', SystemsListView.as_view()),
    url(r'^systems/(?P<system_id>[\w.\-\/]+)/test/?$',
        SystemTestView.as_view()),
    url(r'^systems/(?P<system_id>[\w.\-\/]+)/keys/?$',
        SystemKeysView.as_view()),
    url(r'^systems/(?P<system_id>[\w.\-\/]+)/roles/?$',
        SystemRolesView.as_view()),
    url(r'^systems/(?P<system_id>[\w.\-\/]+)/?$',
        SystemView.as_view()),
]
