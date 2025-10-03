from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from channel_app_template.api import schemas
from channel_app.database import models
from channel_app.reports.services import DashboardService, ReportService
from channel_app_template.api.database import get_db
from channel_app_template.api.enums import ExportType
from channel_app_template.api.pagination import PaginationParams
from channel_app_template.api.helpers import (
    csv_exporter,
    get_task_info_list,
    get_task_map,
    get_task_status,
)
from omnisdk.omnitron.models import Product


router = APIRouter()


@router.get("/flows", response_model=schemas.LogFlowsResponse)
async def get_flows(
    transaction_id: Optional[UUID] = Query(None),
    flow_name: Optional[str] = Query(None),
    flow_author: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    pagination: PaginationParams = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(models.LogFlowModel)

    if transaction_id:
        query = query.filter(models.LogFlowModel.transaction_id == transaction_id)
    if flow_name:
        query = query.filter(models.LogFlowModel.flow_name.ilike(f"%{flow_name}%"))
    if flow_author:
        query = query.filter(models.LogFlowModel.flow_author == flow_author)
    if status:
        query = query.filter(models.LogFlowModel.status == status)

    total = query.count()
    flows = query.offset(pagination.offset).limit(pagination.limit).all()
    return {"total": total, "items": flows}


@router.get("/flows/{flow_id}", response_model=schemas.LogFlowRead)
async def get_flow(flow_id: UUID, db: Session = Depends(get_db)):
    query = db.query(models.LogFlowModel).get(flow_id)
    if query == None:
        raise HTTPException(status_code=404, detail="Flow not found")

    return query


@router.get("/flows/{flow_id}/steps", response_model=List[schemas.LogStepRead])
async def get_flow_steps(flow_id: UUID, db: Session = Depends(get_db)):
    steps = db.query(models.LogStepModel).filter(models.LogStepModel.flow_id == flow_id)
    return steps


@router.get(
    "/steps/{step_id}/exceptions", response_model=List[schemas.LogStepExceptionRead]
)
async def get_step_exceptions(step_id: UUID, db: Session = Depends(get_db)):
    exceptions = db.query(models.LogStepExceptionModel).filter(
        models.LogStepExceptionModel.step_id == step_id
    )
    return exceptions


@router.get("/task-list")
async def list_registered_task():
    return get_task_info_list()


@router.post("/trigger-task")
async def trigger_task(request: schemas.TriggerTaskRequest):
    task_map = get_task_map()

    task_func = task_map.get(request.task_name)
    if not task_func:
        raise HTTPException(status_code=400, detail="Unknown task name")

    try:
        task = task_func.delay(**request.params)
    except TypeError as e:
        raise HTTPException(status_code=400, detail=f"Parameter mismatch: {str(e)}")

    return {"task_id": task.id, "status": "queued"}


@router.get("/task-status/{task_id}")
def task_status(task_id: str):
    return get_task_status(task_id)


@router.get(
    "/reports/not-for-sale-products", response_model=List[schemas.ReportProductResponse]
)
async def get_product_report(limit: int = Query(10, ge=1, le=100)):
    report_service = ReportService()
    products = report_service.get_not_for_sale_products(limit=limit)
    if not products:
        raise HTTPException(status_code=404, detail="No products found")

    return products


@router.post("/reports/differences/price")
async def get_price_difference_report(
    request: schemas.ReportPriceDifferenceRequest,
    export: Optional[bool] = Query(False),
    async_export: Optional[bool] = Query(False),
):
    report_service = ReportService()

    marketplace_products = [
        Product(pk=product.pk, price=product.price, sku=product.sku)
        for product in request.items
    ]

    products = report_service.get_price_differences_from_products(marketplace_products)
    if not products:
        raise HTTPException(status_code=404, detail="No products found")

    if export:
        if async_export:
            from channel_app_template.app.tasks import export_differences_to_csv

            task_result = export_differences_to_csv.delay(products, ExportType.PRICE)
            return get_task_status(task_result.id)
        else:
            file_path = csv_exporter(type=ExportType.PRICE, products=products)
            return {"file_path": file_path}

    return products


@router.post("/reports/differences/stock")
async def get_stock_difference_report(
    request: schemas.ReportStockDifferenceRequest,
    export: Optional[bool] = Query(False),
    async_export: Optional[bool] = Query(False),
):
    report_service = ReportService()

    marketplace_products = [
        Product(pk=product.pk, stock=product.stock, sku=product.sku)
        for product in request.items
    ]

    products = report_service.get_stock_differences_from_products(marketplace_products)
    if not products:
        raise HTTPException(status_code=404, detail="No products found")

    if export:
        if async_export:
            from channel_app_template.app.tasks import export_differences_to_csv

            task_result = export_differences_to_csv.delay(products, ExportType.STOCK)
            return get_task_status(task_result.id)
        else:
            file_path = csv_exporter(type=ExportType.STOCK, products=products)
            return {"file_path": file_path}

    return products

@router.get("/dashboard")
async def dashboard(
    total_sku_limit: int = Query(10, ge=1, le=9999),
    total_sku_on_sale_limit: int = Query(10, ge=1, le=9999),
):
    dashboard_service = DashboardService()

    total_sku = dashboard_service.get_total_sku_from_catalog(
        limit=total_sku_limit
    )
    total_sku_on_sale = dashboard_service.get_total_sku_on_sale_from_catalog(
        limit=total_sku_on_sale_limit
    )
    product_stocks = dashboard_service.get_product_stocks_from_catalog(
        products=total_sku_on_sale,
    )
    total_stocks = dashboard_service.get_total_stock_from_product_stocks(
        product_stocks=product_stocks
    )

    return {
        "total_sku": len(total_sku),
        "total_sku_on_sale": len(total_sku_on_sale),
        "total_product_stocks": len(product_stocks),
        "total_stocks": total_stocks,
    }