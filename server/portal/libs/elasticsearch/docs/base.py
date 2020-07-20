"""
.. module: portal.libs.elasticsearch.docs.base
   :synopsis: Wrapper classes for ES different doc types.
"""
import logging
import datetime
from django.conf import settings
from elasticsearch_dsl import (Document, Date, Object, Text, Long, Boolean,
                               Keyword)
from portal.libs.elasticsearch.analyzers import path_analyzer, file_analyzer, file_pattern_analyzer, reverse_file_analyzer
from portal.libs.elasticsearch.utils import file_uuid_sha256

# pylint: disable=invalid-name
logger = logging.getLogger(__name__)
# pylint: enable=invalid-name

"""
class IndexedProject(Document):
    title = Text(fields={'_exact': Keyword()})
    description = Text()
    created = Date()
    lastModified = Date()
    projectId = Keyword()
    owner = Object(
        properties={
            'username': Keyword(),
            'fullName': Text()
        }
    )
    pi = Object(
        properties={
            'username': Keyword(),
            'fullName': Text()
        }
    )
    coPIs = Object(
        multi=True,
        properties={
            'username': Keyword(),
            'fullName': Text()
        }
    )
    teamMembers = Object(
        multi=True,
        properties={
            'username': Keyword(),
            'fullName': Text()
        }
    )

    @classmethod
    def from_id(cls, projectId):
        search = cls.search()
        search = search.query('term', **{'projectId': projectId})
        try:
            res = search.execute()
        except TransportError as exc:
            if exc.status_code == 404:
                raise
            res = search.execute()
        if res.hits.total.value > 1:
            for doc in res[1:int(res.hits.total.value)]:
                cls.get(doc.meta.id).delete()
            return cls.get(res[0].meta.id)
        elif res.hits.total.value == 1:
            return cls.get(res[0].meta.id)
        else:
            raise DocumentNotFound("No document found for project ID {}.".format(projectId))

    class Index:
        name = settings.ES_INDEX_PREFIX.format('projects')
"""


class IndexedFile(Document):
    """
    Elasticsearch document representing an indexed file. Thin wrapper around
    `elasticsearch_dsl.Document`.
    """
    name = Text(analyzer=file_analyzer, fields={
        '_exact': Keyword(),
        '_pattern': Text(analyzer=file_pattern_analyzer),
        '_reverse': Text(analyzer=reverse_file_analyzer)})
    path = Text(fields={
        '_comps': Text(analyzer=path_analyzer),
        '_exact': Keyword(),
        '_reverse': Text(analyzer=reverse_file_analyzer)},
    )
    lastModified = Date()
    length = Long()
    format = Text()
    mimeType = Keyword()
    type = Text()
    system = Text(fields={'_exact': Keyword()})
    basePath = Text(
        fields={
            '_comps': Text(analyzer=path_analyzer),
            '_exact': Keyword()})
    lastUpdated = Date()
    pems = Object(properties={
        'username': Keyword(),
        'recursive': Boolean(),
        'permission': Object(properties={
            'read': Boolean(),
            'write': Boolean(),
            'execute': Boolean()
        })
    })

    def save(self, *args, **kwargs):
        """
        Sets `lastUpdated` attribute on save. Otherwise see elasticsearch_dsl.Document.save()
        """
        self.lastUpdated = datetime.datetime.now()
        return super(IndexedFile, self).save(*args, **kwargs)

    def update(self, *args, **kwargs):
        """
        Sets `lastUpdated` attribute on save. Otherwise see elasticsearch_dsl.Document.update()
        """
        lastUpdated = datetime.datetime.now()
        return super(IndexedFile, self).update(lastUpdated=lastUpdated, *args, **kwargs)

    @classmethod
    def from_path(cls, system, path):
        """
        Fetches an IndexedFile with the specified system and path.

        Parameters
        ----------
        system: str
            System attribute of the indexed file.
        path: str
            Path attribute of the indexed file.
        Returns
        -------
        IndexedFile

        Raises
        ------
        elasticsearch.exceptions.NotFoundError
        """
        uuid = file_uuid_sha256(system, path)
        return cls.get(uuid)

    def children(self):
        """
        Yields all children of the indexed file. Non-recursive.

        Yields
        ------
        IndexedFile
        """
        search = self.search()
        search = search.filter('term', **{'basePath._exact': self.path})
        search = search.filter('term', **{'system._exact': self.system})

        for hit in search.scan():
            yield self.get(hit.meta.id)

    def delete_recursive(self):
        """
        Recursively delete an indexed file and all of its children.

        Returns
        -------
        Void
        """
        for child in self.children():
            child.delete_recursive()
        self.delete()

    class Index:
        name = settings.ES_INDEX_PREFIX.format('files')


class ReindexedFile(IndexedFile):
    """Identical to IndexedFile, but using a separate index for zero-downtime
    reindexing applications.
    """
    class Index:
        name = settings.ES_INDEX_PREFIX.format('files-reindex')
