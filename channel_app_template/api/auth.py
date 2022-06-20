# from channel_app_template.api.errors import check_error_log
#
#
# async def authentication(omnitron_integration, token, order_json):
#     _token = omnitron_integration.channel.conf.get("token")
#     if token != _token:
#         await check_error_log(omnitron_integration,
#                               "Unauthorized for create order", order_json)
