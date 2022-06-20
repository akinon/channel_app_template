# from typing import List
#
# from pydantic import BaseModel
#
#
# class CanceledOrderItem(BaseModel):
#     barcode: str
#     basket_item_id: str
#     cancel_quantity: int
#
#
# class CancelOrder(BaseModel):
#     tracker_code: str
#     reason: str
#     items: List[CanceledOrderItem]
