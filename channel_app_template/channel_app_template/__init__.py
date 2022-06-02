import os
import sys

sys.path.insert(0, os.getcwd())

os.environ.setdefault("OMNITRON_MODULE",
                      "channel_app_template.akinon.integration")
os.environ.setdefault("CHANNEL_MODULE",
                      "channel_app_template.channel.integration")