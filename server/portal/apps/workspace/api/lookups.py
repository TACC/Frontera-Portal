"""
   :synopsis: Function to lookup manager classes
"""
from __future__ import unicode_literals, absolute_import
from importlib import import_module
import logging
from django.conf import settings
from portal.exceptions.api import ApiException

#pylint: disable=invalid-name
logger = logging.getLogger(__name__)
#pylint: enable=invalid-name

def lookup_manager(name):
    """Lookup data depot manager class"""

    manager_names = list(settings.PORTAL_WORKSPACE_MANAGERS)
    if name not in manager_names:
        raise ApiException("Invalid file manager.")

    module_str, class_str = settings.PORTAL_WORKSPACE_MANAGERS[name].rsplit('.', 1)
    module = import_module(module_str)
    cls = getattr(module, class_str)
    return cls
