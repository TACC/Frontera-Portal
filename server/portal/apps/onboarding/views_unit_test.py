import pytest

pytestmark = pytest.mark.django_db

#  These tests use frontend code that doesn't exist. They only
# run now as we mock the render function.  They are basically just
# a placeholder.


def test_get_self(rf, client, authenticated_user, mock_steps):
    # Test when view is called with a username parameter that matches
    # the requesting user, but the requester is not a staff member
    client.force_login(authenticated_user)
    response = client.get("/onboarding/setup/{}/".format(authenticated_user.username))
    assert response.status_code == 200


def test_get_as_staff(client, authenticated_staff, regular_user, mock_steps):
    # Test when a staff member gets another user
    response = client.get("/onboarding/setup/{}/".format(regular_user.username))
    assert response.status_code == 200


def test_get_forbidden(client, mocker, rf, authenticated_user, staff_user, mock_steps):
    response = client.get("/accounts/setup/{}".format(staff_user.username))
    assert response.status_code == 301
