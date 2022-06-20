# from typing import Optional
#
# from channel_app.core.data import (CancelOrderDto)
# from channel_app.omnitron.constants import ContentType
# from fastapi import FastAPI, status, Header
#
# from channel_app_template.akinon.integration import OmnitronIntegration
# from channel_app_template.api.auth import authentication
# from channel_app_template.api.serializers import CancelOrder
#
# app = FastAPI()
#
# Channel tarafından sipariş iptallerinin POST Edildiği Senaryo
#
# @app.post("/cancel/orders/", status_code=status.HTTP_200_OK)
# async def cancel_orders(cancel_order: CancelOrder,
#                         token: Optional[str] = Header(None)):
#     with OmnitronIntegration(
#             content_type=ContentType.order.value) as omnitron_integration:
#         await authentication(omnitron_integration, token,
#                              cancel_order.json())
#         reason = omnitron_integration.channel.conf.get(
#             'cancellation_reason_id', 4)
#
#         cancel_order_dto = await prepare_cancel_order_dto(cancel_order, reason)
#         canceled_order = omnitron_integration.do_action(
#             key='create_order_cancel',
#             objects=cancel_order_dto)
#
#         if canceled_order:
#             return {"status": "success"}
#         else:
#             return {"status": "failed"}
#
#
# async def prepare_cancel_order_dto(cancel_order, reason):
#     cancel_items = [item.basket_item_id for item in cancel_order.items
#                     for i in range(0, item.cancel_quantity)]
#     cancel_order_dict = {
#         "order": cancel_order.tracker_code,
#         "cancel_items": cancel_items,
#         "reasons": {ci: reason for ci in cancel_items}
#     }
#     cancel_order_dto = CancelOrderDto(**cancel_order_dict)
#     return cancel_order_dto
#
