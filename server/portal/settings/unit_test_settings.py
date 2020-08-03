"""
Django settings for portal project.

Generated by 'django-admin startproject' using Django 1.10.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os


def gettext(s): return s


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

SITE_ID = 1
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '__CHANGE_ME!__'
# SECURITY WARNING: don't run with debug turned on in production!
# Cookie name. this can be whatever you want
SESSION_COOKIE_NAME = 'sessionid'  # use the sessionid in your views code
# the module to store sessions data
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
# age of cookie in seconds (default: 2 weeks)
SESSION_COOKIE_AGE = 24*60*60*7  # the number of seconds for only 7 for example
# whether a user's session cookie expires when the web browser is closed
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
# whether the session cookie should be secure (https:// only)
SESSION_COOKIE_SECURE = False

ALLOWED_HOSTS = ['*']

# Custom Portal Template Assets
PORTAL_ICON_FILENAME = 'path/to/icon.ico'
PORTAL_LOGO_FILENAME = 'path/to/logo.png'
PORTAL_NAVBAR_BACKGROUND_FILENAME = 'path/to/background.png'
PORTAL_DOMAIN = 'test.portal'
PORTAL_ADMIN_USERNAME = 'wma_prtl'

# Application definition

ROOT_URLCONF = 'portal.urls'


INSTALLED_APPS = [

    # django CMS admin style must be before django.contrib.admin
    'djangocms_admin_style',

    # Core Django.
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.sites',  # also required for django CMS
    'django.contrib.sitemaps',
    'django.contrib.sessions.middleware',

    # Django Channels
    'channels',

    # Django recaptcha.
    'captcha',

    # Some django-filer/Pillow stuff
    'filer',
    'easy_thumbnails',
    'mptt',

    # Pipeline.
    'bootstrap4',
    'termsandconditions',
    'impersonate',

    # Custom apps.
    'portal.apps.accounts',
    'portal.apps.auth',
    'portal.apps.tickets',
    'portal.apps.licenses',
    'portal.apps.notifications',
    'portal.apps.onboarding',
    'portal.apps.search',
    'portal.apps.workbench',
    'portal.apps.workspace',
    'portal.apps.system_monitor',

    # django CMS
    'cms',
    'menus',
    'treebeard',
    'sekizai',
    'djangocms_text_ckeditor',
    'djangocms_link',
    'djangocms_file',
    'djangocms_picture',
    'djangocms_video',
    'djangocms_googlemap',
    'djangocms_snippet',
    'djangocms_style',
    'djangocms_column',

]

MIDDLEWARE = [
    # Django core middleware.
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'django.middleware.locale.LocaleMiddleware',    # needed for django CMS
    'impersonate.middleware.ImpersonateMiddleware',  # must be AFTER django.contrib.auth

    # Throws an Error.
    # 'portal.middleware.PortalTermsMiddleware',

    # django CMS
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware',
    'cms.middleware.utils.ApphookReloadMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                'sekizai.context_processors.sekizai',
                'cms.context_processors.cms_settings',

                'portal.utils.contextprocessors.analytics',
                'portal.utils.contextprocessors.debug',
                'portal.utils.contextprocessors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portal.wsgi.application'

AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.ModelBackend']

# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REQUEST_ACCESS = True

IMPERSONATE_REQUIRE_SUPERUSER = True

LOGIN_REDIRECT_URL = '/index/'

# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

CMS_TEMPLATES = (
    ('cms_page.html', 'Main Site Page'),
)

LANGUAGES = [
    ('en-us', 'US English')
]
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

FIXTURE_DIRS = [
    os.path.join(BASE_DIR, 'fixtures'),
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'test'
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'test',
#         'USER': 'dev',
#         'PASSWORD': 'dev',
#         'HOST': 'frontera_prtl_postgres',
#         'PORT': '5432'
#     }
# }

ALLOCATION_SYSTEMS = []

PORTAL_NAMESPACE = 'test'
PORTAL_ALLOCATION = 'test'

PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_ABS_PATH = '/path/to/home_dirs'
PORTAL_DATA_DEPOT_WORK_HOME_DIR_FS = '/work'
PORTAL_DATA_DEPOT_WORK_HOME_DIR_EXEC_SYSTEM = 'stampede2'
# Relative path from the default sotrage system where home directories
# should be created.
# Use only if all home directories are under one parent directory.
PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_REL_PATH = 'home_dirs'
PORTAL_DATA_DEPOT_USER_SYSTEM_PREFIX = 'cep.home.{}'
PORTAL_DATA_DEPOT_STORAGE_HOST = 'data.tacc.utexas.edu'

PORTAL_DATA_DEPOT_PROJECT_SYSTEM_PREFIX = 'cep.project'

PORTAL_USER_HOME_MANAGER = 'portal.apps.accounts.managers.user_home.UserHomeManager'
PORTAL_KEYS_MANAGER = 'portal.apps.accounts.managers.ssh_keys.KeysManager'
PORTAL_PROJECTS_PEMS_APP_ID = 'pems.app-test'

PORTAL_PROJECTS_NAME_PREFIX = 'cep.project'

PORTAL_PROJECTS_ID_PREFIX = 'cep.project'

PORTAL_PROJECTS_ROOT_DIR = '/path/to/root'

PORTAL_PROJECTS_ROOT_SYSTEM_NAME = 'projects.system.name'

PORTAL_PROJECTS_ROOT_HOST = 'host.for.projects'

PORTAL_PROJECTS_SYSTEM_PORT = 22

PORTAL_PROJECTS_PRIVATE_KEY = ('-----BEGIN RSA PRIVATE KEY-----'
                               'change this'
                               '-----END RSA PRIVATE KEY-----')
PORTAL_PROJECTS_PUBLIC_KEY = 'ssh-rsa change this'

PORTAL_USER_ACCOUNT_SETUP_STEPS = [
    'portal.apps.onboarding.steps.test_steps.MockStep'
]
PORTAL_USER_ACCOUNT_SETUP_WEBHOOK_PWD = 'dev'

PORTAL_DATA_DEPOT_MANAGERS = {
    'my-data': 'portal.apps.data_depot.managers.private_data.FileManager',
    'shared': 'portal.apps.data_depot.managers.shared.FileManager',
    'my-projects': 'portal.apps.data_depot.managers.projects.FileManager',
    'google-drive': 'portal.apps.data_depot.managers.google_drive.FileManager'
}

PORTAL_SEARCH_MANAGERS = {
    'my-data': 'portal.apps.search.api.managers.private_data_search.PrivateDataSearchManager',
    'shared': 'portal.apps.search.api.managers.shared_search.SharedSearchManager',
    'cms': 'portal.apps.search.api.managers.cms_search.CMSSearchManager',
    # 'my-projects': 'portal.apps.data_depot.managers.projects.FileManager'
}

PORTAL_JOB_NOTIFICATION_STATES = ["PENDING", "STAGING_INPUTS", "SUBMITTING", "QUEUED", "RUNNING", "FINISHED", "STOPPED", "CANCELLED", "FAILED", "BLOCKED"]

EXTERNAL_RESOURCE_SECRETS = {
    "google-drive": {
        "client_secret": "test",
        "client_id": "test",
        "name": "Google Drive",
        "directory": "external-resources"
    }
}

PORTAL_DATA_DEPOT_PAGE_SIZE = 100

PORTAL_WORKSPACE_MANAGERS = {
    'private': 'portal.apps.workspace.managers.private.FileManager',
    'shared': 'portal.apps.workspace.managers.shared.FileManager',
}
PORTAL_WORKSPACE_PAGE_SIZE = 100
# TAS Authentication.
TAS_URL = 'https://test.com'
TAS_CLIENT_KEY = 'test'
TAS_CLIENT_SECRET = 'test'
# Redmine Tracker Authentication.
RT_URL = 'test'
RT_HOST = 'https://test.com'
RT_UN = 'test'
RT_PW = 'test'
RT_QUEUE = 'test'
RT_TAG = 'test_tag'

# Agave Tenant.
AGAVE_TENANT_ID = 'portal'
AGAVE_TENANT_BASEURL = 'https://api.example.com'

# Agave Client Configuration
AGAVE_CLIENT_KEY = 'test'
AGAVE_CLIENT_SECRET = 'test'
AGAVE_SUPER_TOKEN = 'test'
AGAVE_STORAGE_SYSTEM = 'test'
AGAVE_COMMUNITY_DATA_SYSTEM = 'test.storage'
AGAVE_PUBLIC_DATA_SYSTEM = 'test.public'
AGAVE_DEFAULT_TRASH_NAME = 'test'

AGAVE_JWT_HEADER = 'HTTP_X_AGAVE_HEADER'
AGAVE_JWT_ISSUER = 'wso2.org/products/am'
AGAVE_JWT_USER_CLAIM_FIELD = 'http://wso2.org/claims/fullname'

ES_HOSTS = ['test.com']
ES_AUTH = "user:password"
ES_INDEX_PREFIX = "test-staging-{}"

SYSTEM_MONITOR_URL = "https://sysmon.example.com/foo.json"

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': ('haystack.backends.elasticsearch_backend.'
                   'ElasticsearchSearchEngine'),
        'URL': 'test:9200/',
        'INDEX_NAME': 'cms',
    }
}
HAYSTACK_ROUTERS = ['aldryn_search.router.LanguageRouter', ]

"""
SETTINGS: LOGGING
"""

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '[DJANGO-TEST] %(levelname)s %(asctime)s %(module)s '
                      '%(name)s.%(funcName)s:%(lineno)s: %(message)s'
        },
        'agave': {
            'format': '[AGAVE-TEST] %(levelname)s %(asctime)s %(module)s '
                      '%(name)s.%(funcName)s:%(lineno)s: %(message)s'
        },
        'metrics': {
            'format': '[METRICS-TEST] %(levelname)s %(module)s %(name)s.'
                      '%(funcName)s:%(lineno)s: %(message)s '
                      'user=%(user)s sessionId=%(sessionId)s '
                      'op=%(operation)s info=%(info)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        },
        'metrics_console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'metrics',
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'portal': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'metrics': {
            'handlers': ['metrics_console'],
            'level': 'INFO',
        },
        'paramiko': {
            'handlers': ['console'],
            'level': 'DEBUG'
        }
    },
}

MIGRATION_MODULES = {
    'auth': None,
    'cms': None,
    'contenttypes': None,


    'default': None,
    'core': None,
    'profiles': None,

    # 'snippets': None,
    'sites': None,

    # 'scaffold_templates': None,

    'djangocms_column': None,
    'djangocms_file': None,
    'djangocms_googlemap': None,
    'djangocms_link': None,
    'djangocms_picture': None,
    'djangocms_snippet': None,
    'djangocms_style': None,
    'djangocms_text_ckeditor': None,
    'djangocms_video': None,
    'easy_thumbnails': None,
    'filer': None,
    'sessions': None,
}

COMMUNITY_INDEX_SCHEDULE = {'hour': 0, 'minute': 0, 'day_of_week': 0}

# CMS Test Coverage for Settings.

CMS_PERMISSION = True

CMS_PLACEHOLDER_CONF = {}


CMSPLUGIN_FILER_IMAGE_STYLE_CHOICES = (
    ('default', 'Default'),
)
CMSPLUGIN_FILER_IMAGE_DEFAULT_STYLE = 'default'

# These settings enable iFrames in the CMS cktext-editor.
TEXT_ADDITIONAL_TAGS = ('iframe',)
TEXT_ADDITIONAL_ATTRIBUTES = ('scrolling', 'allowfullscreen', 'frameborder', 'src', 'height', 'width')

TEXT_SAVE_IMAGE_FUNCTION = 'cmsplugin_filer_image.integrations.ckeditor.create_image_plugin'

THUMBNAIL_HIGH_RESOLUTION = True

THUMBNAIL_PROCESSORS = (
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    'filer.thumbnail_processors.scale_and_crop_with_subject_location',
    'easy_thumbnails.processors.filters',
    'easy_thumbnails.processors.background'
)

CKEDITOR_SETTINGS = {
    'language': '{{ language }}',
    'skin': 'moono-lisa',
    'toolbar': 'CMS',
}

# DJANGOCMS_FORMS_RECAPTCHA_PUBLIC_KEY = RECAPTCHA_PUBLIC_KEY
# DJANGOCMS_FORMS_RECAPTCHA_SECRET_KEY = RECAPTCHA_PRIVATE_KEY

SILENCED_SYSTEM_CHECKS = ['captcha.recaptcha_test_key_error']

DJANGOCMS_AUDIO_ALLOWED_EXTENSIONS = ['mp3', 'ogg', 'wav']

DJANGOCMS_VIDEO_ALLOWED_EXTENSIONS = ['mp4', 'webm', 'ogv']

# Channels
ASGI_APPLICATION = 'portal.routing.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}
PORTAL_DATA_DEPOT_DEFAULT_LOCAL_STORAGE_SYSTEM = 'frontera'
PORTAL_DATA_DEPOT_LOCAL_STORAGE_SYSTEMS = {
    'frontera': {
        'name': 'My Data (Frontera)',
        'prefix': 'frontera.home.{}',                                   # PORTAL_DATA_DEPOT_USER_SYSTEM_PREFIX
        'host': 'frontera.tacc.utexas.edu',                             # PORTAL_DATA_DEPOT_STORAGE_HOST
        'abs_home_directory': '/corral-repl/tacc/aci/CEP/home_dirs/',   # PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_ABS_PATH
        'home_directory': '/home1',                                     # PORTAL_DATA_DEPOT_WORK_HOME_DIR_FS
        'relative_path': 'home_dirs',                                   # PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_REL_PATH
        'requires_allocation': None,                                    # Should the default system require allocation to be viewed?
        'icon': None,
    },
    'longhorn': {
        'name': 'My Data (Longhorn)',
        'prefix': 'longhorn.home.{}',
        'host': 'longhorn.tacc.utexas.edu',
        'abs_home_directory': '/home/',
        'home_directory': '/home',
        'relative_path': 'home',
        'requires_allocation': 'longhorn3',
        'icon': None,
    },
}
