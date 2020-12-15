from portal.apps.auth.tasks import get_user_storage_systems
from portal.views.base import BaseApiView
from django.conf import settings
from django.http import JsonResponse, HttpResponseForbidden
from requests.exceptions import HTTPError
import json
import logging
from portal.apps.datafiles.handlers.tapis_handlers import (tapis_get_handler,
                                                           tapis_put_handler,
                                                           tapis_post_handler)
from portal.apps.users.utils import get_allocations
from portal.apps.accounts.managers.user_systems import UserSystemsManager
from portal.apps.datafiles.models import Link
from portal.exceptions.api import ApiException


logger = logging.getLogger(__name__)


class SystemListingView(BaseApiView):
    """System Listing View"""

    def get(self, request):
        portal_systems = settings.PORTAL_DATAFILES_STORAGE_SYSTEMS
        local_systems = settings.PORTAL_DATA_DEPOT_LOCAL_STORAGE_SYSTEMS

        user_systems = get_user_storage_systems(request.user.username, local_systems)
        # compare available storage systems to the systems a user can access
        response = {'system_list': []}
        for system_name, details in user_systems.items():
            response['system_list'].append(
                {
                    'name': details['name'],
                    'system':  UserSystemsManager(request.user, system_name=system_name).get_system_id(),
                    'scheme': 'private',
                    'api': 'tapis',
                    'icon': details['icon']
                }
            )
        response['system_list'] += portal_systems
        default_system = user_systems[settings.PORTAL_DATA_DEPOT_LOCAL_STORAGE_SYSTEM_DEFAULT]
        response['default_host'] = default_system['host']

        return JsonResponse(response)


class TapisFilesView(BaseApiView):
    def get(self, request, operation=None, scheme=None, system=None, path='/'):
        try:
            client = request.user.agave_oauth.client
        except AttributeError:
            client = None
        try:
            response = tapis_get_handler(
                client, scheme, system, path, operation, **request.GET.dict())
        except HTTPError as e:
            error_status = e.response.status_code
            error_json = e.response.json()
            if error_status == 502:
                # In case of 502 determine cause
                system = dict(client.systems.get(systemId=system))
                allocations = get_allocations(request.user.username)

                # If user is missing an allocation mangle error to a 403
                if system['storage']['host'] not in allocations['hosts']:
                    e.response.status_code = 403
                    raise e

                # If a user needs to push keys, return a response specifying the system
                error_json['system'] = system
                return JsonResponse(error_json, status=error_status)
            raise e

        return JsonResponse({'data': response})

    def put(self, request, operation=None, scheme=None,
            handler=None, system=None, path='/'):
        body = json.loads(request.body)
        try:
            client = request.user.agave_oauth.client
        except AttributeError:
            return HttpResponseForbidden

        response = tapis_put_handler(client, scheme, system, path, operation, body=body)

        return JsonResponse({"data": response})

    def post(self, request, operation=None, scheme=None,
             handler=None, system=None, path='/'):
        body = request.FILES.dict()
        try:
            client = request.user.agave_oauth.client
        except AttributeError:
            return HttpResponseForbidden()

        response = tapis_post_handler(client, scheme, system, path, operation, body=body)

        return JsonResponse({"data": response})


class LinkView(BaseApiView):
    def create_postit(self, request, scheme, system, path):
        try:
            client = request.user.agave_oauth.client
        except AttributeError:
            raise HttpResponseForbidden
        body = {
            "url": "{tenant}/files/v2/media/system/{system}/{path}".format(
                tenant=settings.AGAVE_TENANT_BASEURL,
                system=system,
                path=path
            ),
            "unlimited": True
        }
        response = client.postits.create(body=body)
        postit = response['_links']['self']['href']
        link = Link.objects.create(
            agave_uri=f"{system}/{path}",
            postit_url=postit
        )
        link.save()
        return postit

    def delete_link(self, request, link):
        try:
            client = request.user.agave_oauth.client
        except AttributeError:
            raise HttpResponseForbidden
        response = client.postits.delete(uuid=link.get_uuid())
        link.delete()
        return response

    def get(self, request, scheme, system, path):
        """Given a file, returns a link for a file
        """
        try:
            link = Link.objects.get(agave_uri=f"{system}/{path}")
        except Link.DoesNotExist:
            return JsonResponse({"data": None})
        return JsonResponse({"data": link.postit_url})

    def delete(self, request, scheme, system, path):
        """Delete an existing link for a file
        """
        try:
            link = Link.objects.get(agave_uri=f"{system}/{path}")
        except Link.DoesNotExist:
            raise ApiException("Post-it does not exist")
        response = self.delete_link(request, link)
        return JsonResponse({"data": response})

    def post(self, request, scheme, system, path):
        """Generates a new link for a file
        """
        try:
            link = Link.objects.get(agave_uri=f"{system}/{path}")
        except Link.DoesNotExist:
            # Link doesn't exist - proceed with creating one
            response = self.create_postit(request, scheme, system, path)
            return JsonResponse({"data": response})
        # Link for this file already exists, raise an exception
        raise ApiException("Link for this file already exists")

    
    def put(self, request, scheme, system, path):
        """Replace an existing link for a file
        """
        try:
            link = Link.objects.get(agave_uri=f"{system}/{path}")
            self.delete_link(request, link)
        except Link.DoesNotExist:
            raise ApiException("Could not find pre-existing link")
        response = self.create_postit(request, scheme, system, path)
        return JsonResponse({"data": response})
