from pydantic import BaseModel, UUID4
from typing import Any, Dict, List, Optional
from datetime import datetime
from channel_app.logs.enums import LogFlowAuthor, LogStepStatus


class LogStepExceptionRead(BaseModel):
    id: UUID4
    step_id: UUID4
    type: str
    message: Optional[str]
    traceback: Optional[str]
    created_at: datetime


class LogStepRead(BaseModel):
    id: UUID4
    flow_id: UUID4
    step_name: str
    status: LogStepStatus
    start_time: datetime
    end_time: Optional[datetime]
    duration_ms: Optional[int]
    error_message: Optional[str]
    step_metadata: Optional[dict]
    exceptions: List[LogStepExceptionRead] = []


class LogFlowRead(BaseModel):
    id: UUID4
    transaction_id: UUID4
    flow_name: str
    flow_author: LogFlowAuthor
    started_at: datetime
    ended_at: Optional[datetime]
    status: Optional[LogStepStatus]
    s3_key: Optional[str]


class LogFlowsResponse(BaseModel):
    total: int
    items: list[LogFlowRead]


class TriggerTaskRequest(BaseModel):
    task_name: str
    params: Dict[str, Any]


class ReportProductResponse(BaseModel):
    pk: int
    name: str
    sku: str
    created_date: datetime
    modified_date: datetime


class ReportMarketplaceProductPrice(BaseModel):
    pk: int
    price: float
    sku: str


class ReportMarketplaceProductStock(BaseModel):
    pk: int
    stock: int
    sku: str


class ReportPriceDifferenceRequest(BaseModel):
    items: List[ReportMarketplaceProductPrice]


class ReportStockDifferenceRequest(BaseModel):
    items: List[ReportMarketplaceProductStock]