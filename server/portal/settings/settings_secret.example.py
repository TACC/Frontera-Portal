"""
All secret values (eg. configurable per project) - usually stored in UT stache.
"""

########################
# DJANGO SETTINGS COMMON
########################

_SECRET_KEY = 'CHANGE ME !'
_DEBUG = True
_WSGI_APPLICATION = 'ws4redis.django_runserver.application'
# _WSGI_APPLICATION = 'portal.wsgi.application'

########################
# DJANGO SETTINGS LOCAL
########################

# Database.
_DJANGO_DB_ENGINE= 'django.db.backends.postgresql'
_DJANGO_DB_HOST= 'cep_postgres'
_DJANGO_DB_PORT= '5432'
_DJANGO_DB_NAME= 'dev'
_DJANGO_DB_USER= 'dev'
_DJANGO_DB_PASSWORD= 'dev'

# TAS Authentication.
_TAS_URL='https://tas-dev.tacc.utexas.edu/api'
_TAS_CLIENT_KEY='key'
_TAS_CLIENT_SECRET='secret'

# Redmine Tracker Authentication.
_RT_URL='https://consult.tacc.utexas.edu/REST/1.0'
_RT_UN='username'
_RT_PW='password'

# Recaptcha Authentication.
_RECAPTCHA_PUBLIC_KEY='public_key'
_RECAPTCHA_PRIVATE_KEY='private_key'
_RECAPTCHA_USE_SSL='True'

########################
# AGAVE SETTINGS
########################

# Agave Tenant.
_AGAVE_TENANT_ID = 'tenant_name'
_AGAVE_TENANT_BASEURL = 'https://agave.mytenant.org'

# Agave Client Configuration
_AGAVE_CLIENT_KEY = 'TH1$_!$-MY=K3Y!~'
_AGAVE_CLIENT_SECRET = 'TH1$_!$-My=S3cr3t!~'
_AGAVE_SUPER_TOKEN = 'S0m3T0k3n_tHaT-N3v3r=3xp1R35'
_AGAVE_STORAGE_SYSTEM = 'my.storage.default'
_AGAVE_COMMUNITY_DATA_SYSTEM = 'storage_system'

########################
# RABBITMQ SETTINGS
########################

_BROKER_URL_USERNAME = 'dev'
_BROKER_URL_PWD = 'dev'
_BROKER_URL_HOST = 'dev'
_BROKER_URL_PORT = '5672'
_BROKER_URL_VHOST = 'dev'

_RESULT_BACKEND_USERNAME = 'username'
_RESULT_BACKEND_PWD = 'pwd'
_RESULT_BACKEND_HOST = 'localhost'
_RESULT_BACKEND_PORT = '6379'
_RESULT_BACKEND_DB = '0'

########################
# ELASTICSEARCH SETTINGS
########################

# TBD.

########################
# CELERY SETTINGS
########################

# TBD.

########################
# LOGGING SETTINGS
########################

# TBD.

########################
# DJANGO APP: WORKSPACE
########################

# TBD

########################
# DJANGO APP: DATA DEPOT
########################
# Absolute path where home directories should be created.
#Absolute with respect to the host
# Use only if all home directories are under one parent directory.
_PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_ABS_PATH = '/path/to/home_dirs'
# Relative path from the default sotrage system where home directories
# should be created.
# Use only if all home directories are under one parent directory.
_PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_REL_PATH = 'home_dirs'
_PORTAL_DATA_DEPOT_USER_SYSTEM_PREFIX = 'cep.home'
_PORTAL_DATA_DEPOT_STORAGE_HOST = 'data.tacc.utexas.edu'

_PORTAL_DATA_DEPOT_PROJECT_SYSTEM_PREFIX = 'cep.project'

_PORTAL_USER_HOME_MANAGER = 'portal.apps.accounts.managers.user_home.UserHomeManager'
_PORTAL_KEYS_MANAGER = 'portal.apps.accounts.managers.ssh_keys.KeysManager'
_PORTAL_USER_ACCOUNT_SETUP_STEPS = [
    'portal.apps.accounts.steps.step_one',
    'portal.apps.accounts.steps.step_two',
    'portal.apps.accounts.steps.StepThree',
]
# TBD

########################
# DJANGO CMS SETTINGS
########################

# TBD.
