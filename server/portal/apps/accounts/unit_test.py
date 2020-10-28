def test_account_redirect(client, authenticated_user):
    response = client.get('/accounts/profile/')
    assert response.status_code == 302
    assert response.url == '/workbench/account/'
