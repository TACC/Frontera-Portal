"""
.. module: portal.apps.search.api.managers.shared_search
   :synopsis: Manager handling Shared data searches.
"""

from __future__ import unicode_literals, absolute_import
import logging
from future.utils import python_2_unicode_compatible
from portal.apps.search.api.managers.base import BaseSearchManager
from portal.libs.elasticsearch.docs.base import IndexedFile
from elasticsearch_dsl import Q
from django.conf import settings

@python_2_unicode_compatible
class SharedSearchManager(BaseSearchManager):
    """ Search manager handling shared data.
    """

    def __init__(self, request=None, **kwargs):
        if request:
            self._username = request.user.username
            self._query_string = request.GET.get('queryString')
        else:
            self._username = kwargs.get(
                'username', settings.PORTAL_ADMIN_USERNAME)
            self._query_string = kwargs.get('query_string')

        self._system = settings.AGAVE_COMMUNITY_DATA_SYSTEM

        super(SharedSearchManager, self).__init__(
            IndexedFile, IndexedFile.search())

    def search(self, offset, limit):
        """runs a search and returns an ES search object."""

        self.filter(Q({'term': {'system._exact': self._system}}))

        self.query("query_string", query=self._query_string,
                   fields=["name", "name._exact"], minimum_should_match="80%")

        self.extra(from_=offset, size=limit)
        return self._search

    def listing(self, ac):
        """Wraps the search result in a BaseFile object for serializtion."""

        return self._listing(ac, self._system)
