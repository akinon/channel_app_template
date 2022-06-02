from celery import Celery
from celery.signals import celeryd_init

import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

from channel_app_template import settings
from channel_app_template.celery_app.celery_schedule_conf import \
    CELERYBEAT_SCHEDULE

app = Celery('celery_app')


## Broker settings.
app.config_from_object('channel_app_template.celery_app.celeryconfig')
# List of modules to import when the Celery worker starts.
app.autodiscover_tasks()
# Fill this beat_schedule parameters with the tasks listed under channel_app.app.*.tasks
# so that they are executed regularly. Do not over-execute long running tasks( for example
# category update tasks are resource heavy operations and they do not get regular updates,
# they should run once or twice every week) otherwise they might
# TODO set up cron timings for all tasks here
app.conf.beat_schedule = CELERYBEAT_SCHEDULE


@celeryd_init.connect()
def configure_sentry(**kwargs):
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[CeleryIntegration()]
    )
