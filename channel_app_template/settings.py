import redis
from channel_app_template import *
from channel_app.core.settings import *

redis_instance = redis.Redis(host=BROKER_HOST, port=BROKER_PORT, db=BROKER_DATABASE_INDEX)
redis_instance.flushall()

