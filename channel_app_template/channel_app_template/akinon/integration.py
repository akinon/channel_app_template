from channel_app.omnitron.integration import \
    OmnitronIntegration as AppOmnitronIntegration


class OmnitronIntegration(AppOmnitronIntegration):
    def __init__(self, create_batch=True, content_type=None):
        from channel_app_template import settings
        self.create_batch = create_batch
        self.content_type = content_type
        self.channel_id = settings.OMNITRON_CHANNEL_ID
        self.catalog_id = settings.OMNITRON_CATALOG_ID
        self.base_url = settings.OMNITRON_URL
        self.username = settings.OMNITRON_USER
        self.password = settings.OMNITRON_PASSWORD
        # TODO: add your new processes here (new_actions)
        new_actions = {}
        self.actions.update(new_actions)
