# from datetime import datetime
#
# from channel_app.core.data import ErrorReportDto
# from fastapi import HTTPException
#
#
# async def check_error_log(integration, raw_response=None, raw_request="",
#                           raise_exc=True, error_code=None):
#     error_cd = error_code or "CreateOrder"
#     report = ErrorReportDto(
#         action_content_type="batchrequest",
#         action_object_id=integration.batch_request.pk,
#         modified_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#         error_code=f"{integration.batch_request.local_batch_id}-{error_cd}",
#         error_description=f"{integration.batch_request.local_batch_id}-{error_cd}",
#         raw_request=raw_request,
#         raw_response=raw_response,
#         is_ok=not raise_exc
#     )
#     integration.do_action(
#         key='create_error_report',
#         objects=report)
#     response = {"status": "failed", "details": raw_response}
#     if raise_exc:
#         raise HTTPException(status_code=400,
#                             detail=response)
#     return
