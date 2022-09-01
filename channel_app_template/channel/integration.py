from channel_app.channel.integration import ChannelIntegration as AppChannelIntegration

from channel_app_template.channel.commands.orders.orders import (
    GetOrders, SendUpdatedOrders, CheckOrders, GetCancelledOrders
)
from channel_app_template.channel.commands.product_prices import (
    SendUpdatedPrices, SendInsertedPrices, CheckPrices
)
from channel_app_template.channel.commands.product_stocks import (
    SendUpdatedStocks, SendInsertedStocks, CheckStocks
)
from channel_app_template.channel.commands.products import (
    SendInsertedProducts, SendUpdatedProducts, SendDeletedProducts,
    CheckProducts, CheckDeletedProducts
)
from channel_app_template.channel.commands.setup import (
    GetCategoryTreeAndNodes, GetCategoryAttributes, GetChannelConfSchema,
    GetAttributes
)


class ChannelIntegration(AppChannelIntegration):
    _sent_data = {}
    actions = {
        "send_inserted_products": SendInsertedProducts,
        "send_updated_products": SendUpdatedProducts,
        "send_deleted_products": SendDeletedProducts,
        "check_products": CheckProducts,
        "check_deleted_products": CheckDeletedProducts,
        "send_updated_stocks": SendUpdatedStocks,
        "send_inserted_stocks": SendInsertedStocks,
        "send_updated_prices": SendUpdatedPrices,
        "send_inserted_prices": SendInsertedPrices,
        "check_stocks": CheckStocks,
        "check_prices": CheckPrices,
        "get_category_tree_and_nodes": GetCategoryTreeAndNodes,
        "get_channel_conf_schema": GetChannelConfSchema,
        "get_category_attributes": GetCategoryAttributes,
        "get_attributes": GetAttributes,
        "get_orders": GetOrders,
        "send_updated_orders": SendUpdatedOrders,
        "check_orders": CheckOrders,
        "get_cancelled_orders": GetCancelledOrders
    }

    def __init__(self):
        from channel_app_template import settings
        self.channel_id = settings.OMNITRON_CHANNEL_ID
        self.catalog_id = settings.OMNITRON_CATALOG_ID
