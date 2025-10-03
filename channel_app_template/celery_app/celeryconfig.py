from channel_app_template import settings

accept_content = ['json']
task_serializer = 'json'
result_serializer = 'json'
broker_url = f'redis://{settings.BROKER_HOST}:{settings.BROKER_PORT}/{settings.BROKER_DATABASE_INDEX}'
result_backend = broker_url