from channel_app.app.order.service import OrderService
from channel_app.app.product.service import ProductService
from channel_app.app.product_image.service import ImageService
from channel_app.app.product_price.service import PriceService
from channel_app.app.product_stock.service import StockService
from channel_app.app.setup.service import SetupService
from channel_app.core.utilities import LockTask

from channel_app_template.celery_app.celery import app


# SETUP TASKS
# Use LockTask for the same tasks run only once at a time
@app.task(base=LockTask)
def update_channel_conf_schema():
    service = SetupService()
    service.update_channel_conf_schema()


@app.task
def create_or_update_category_tree_and_nodes():
    service = SetupService()
    service.create_or_update_category_tree_and_nodes(is_success_log=False)


@app.task()
def create_or_update_category_attributes():
    service = SetupService()
    service.create_or_update_category_attributes(is_success_log=False)


@app.task()
def create_or_update_attributes():
    service = SetupService()
    service.create_or_update_attributes(is_success_log=False)


# PRODUCT TASKS


@app.task
def insert_and_update_products():
    service = ProductService()
    service.insert_products(add_mapped=False,
                            add_stock=False,
                            add_price=False,
                            add_categories=False,
                            is_success_log=True,
                            is_sync=True)
    service.update_products(add_mapped=False,
                            add_stock=False,
                            add_price=False,
                            add_categories=False,
                            is_success_log=True,
                            is_sync=True)


@app.task
def update_products():
    service = ProductService()
    service.update_products(add_mapped=False,
                            add_stock=False,
                            add_price=False,
                            add_categories=False,
                            is_success_log=True,
                            is_sync=True)


@app.task
def delete_products():
    service = ProductService()
    service.delete_products(is_sync=True, is_success_log=True)


@app.task
def check_delete_products():
    service = ProductService()
    service.get_delete_product_batch_requests(is_success_log=True)


@app.task
def check_products():
    service = ProductService()
    service.get_product_batch_requests(is_success_log=True)


# STOCK TASKS


@app.task
def insert_and_update_stocks():
    service = StockService()
    service.insert_product_stocks(is_sync=True, is_success_log=True,
                                  add_product_objects=False, add_price=False)
    service.update_product_stocks(is_sync=True, is_success_log=True,
                                  add_product_objects=False, add_price=False)


@app.task
def update_stocks():
    service = StockService()
    service.update_product_stocks(is_sync=True, is_success_log=True,
                                  add_product_objects=False, add_price=False)


@app.task
def check_stocks():
    service = StockService()
    service.get_stock_batch_requests(is_success_log=True)


# PRICE TASKS


@app.task
def insert_and_update_prices():
    service = PriceService()
    service.insert_product_prices(is_sync=True, is_success_log=True,
                                  add_product_objects=False, add_stock=False)
    service.update_product_prices(is_sync=True, is_success_log=True,
                                  add_product_objects=False, add_stock=False)


@app.task
def update_prices():
    service = PriceService()
    service.update_product_prices(is_sync=True, is_success_log=True,
                                  add_product_objects=False, add_stock=False)


@app.task
def check_prices():
    service = PriceService()
    service.get_price_batch_requests(is_success_log=True)


# IMAGE TASKS

@app.task
def insert_and_update_images():
    service = ImageService()
    service.insert_product_images(is_sync=True, is_success_log=True)
    service.update_product_images(is_sync=True, is_success_log=True)


@app.task
def update_images():
    service = ImageService()
    service.update_product_images(is_sync=True, is_success_log=True)


@app.task
def check_images():
    service = ImageService()
    service.get_image_batch_requests(is_success_log=True)


# ORDER TASKS


@app.task
def fetch_orders():
    service = OrderService()
    service.fetch_and_create_order(is_success_log=True)


@app.task
def update_orders():
    service = OrderService()
    service.update_orders(is_sync=True, is_success_log=True)


@app.task
def check_orders():
    service = OrderService()
    service.get_order_batch_requests(is_success_log=True)


@app.task
def fetch_and_create_cancel():
    service = OrderService()
    service.fetch_and_create_cancel(is_success_log=True)


@app.task
def fetch_and_update_order_items():
    service = OrderService()
    service.fetch_and_update_order_items(is_success_log=True)


@app.task
def fetch_and_create_cancellation_requests():
    service = OrderService()
    service.fetch_and_create_cancellation_requests(is_success_log=True)

@app.task
def update_cancellation_requests():
    service = OrderService()
    service.update_cancellation_requests(is_success_log=True)