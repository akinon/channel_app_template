import csv
from datetime import datetime
import inspect
import os
from typing import Any, Dict, List
from channel_app_template.api.enums import ExportType
from channel_app_template.celery_app import app


def get_task_map():
    task_map = {}
    for name, task in app.tasks.items():
        if name.startswith("celery."):
            continue

        task_map[name] = task
    return task_map


def get_task_info_list():
    task_map = get_task_map()
    task_info_list = []

    for task_name, task in task_map.items():
        try:
            func = task.run
            sig = inspect.signature(func)
            args = list(sig.parameters.keys())
        except Exception:
            args = []

        task_info_list.append({"name": task_name, "args": args})

    return task_info_list


def get_task_status(task_id: str):
    async_result = app.AsyncResult(task_id)

    return {
        "task_id": task_id,
        "status": async_result.status,  # PENDING, STARTED, SUCCESS, FAILURE...
        "result": async_result.result if async_result.successful() else None,
        "error": str(async_result.result) if async_result.failed() else None,
        "ready": async_result.ready(),
    }


def csv_exporter(type: ExportType, products: List[Dict[str, Any]]):
    export_path = os.path.join(
        "channel_app_template", "api", "exports", type.name.lower()
    )
    if not os.path.exists(export_path):
        os.makedirs(export_path, exist_ok=True)

    row_headers = None
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    if type == ExportType.PRICE:
        row_headers = ["Product PK", "Product SKU", "Price Difference", "Updated At"]
        file_path = os.path.join(export_path, f"price_differences_{timestamp}.csv")
    elif type == ExportType.STOCK:
        row_headers = ["Product PK", "Product SKU", "Stock Difference", "Updated At"]
        file_path = os.path.join(export_path, f"stock_differences_{timestamp}.csv")

    with open(file_path, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(row_headers)

        if type == ExportType.STOCK:
            rows = [
                [
                    product["product_pk"],
                    product["product_sku"],
                    product["stock_difference"],
                    product["updated_at"],
                ]
                for product in products
            ]
        elif type == ExportType.PRICE:
            rows = [
                [
                    product["product_pk"],
                    product["product_sku"],
                    product["price_difference"],
                    product["updated_at"],
                ]
                for product in products
            ]

        writer.writerows(rows)

    return file_path