import pytest
from portal.apps.projects.models.base import Project


@pytest.mark.django_db
@pytest.fixture()
def service_account(mocker):
    yield mocker.patch('portal.apps.projects.models.base.service_account')


@pytest.fixture()
def mock_storage_system(mocker):
    yield mocker.patch('portal.apps.projects.models.base.StorageSystem')


@pytest.fixture()
@pytest.mark.django_db
def project_model(mocker):
    mocker.patch('portal.apps.projects.models.base.Project._create_dir')
    mocker.patch('portal.apps.projects.models.base.Project._delete_dir')
    yield Project


@pytest.fixture()
def mock_projects(project_model, service_account, mock_storage_system, mock_agave_client, regular_user):
    prj1 = Project.create(mock_agave_client, 'First Project', 'test.project-123', regular_user)
    prj1.storage.name = 'test.project-123'
    prj1.storage.id = 'test.project-123'
    prj2 = Project.create(mock_agave_client, 'Second Project', 'test.project-124', regular_user)
    prj2.storage.name = 'test.project-124'
    prj2.storage.id = 'test.project-124'
    yield [prj1, prj2]


@pytest.fixture()
def mock_projects_storage_systems(mock_projects):
    yield [prj.storage for prj in mock_projects]
