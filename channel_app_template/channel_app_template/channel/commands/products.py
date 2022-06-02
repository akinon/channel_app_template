from typing import List, Tuple, Any

from channel_app.channel.commands.products import (
    SendInsertedProducts as AppSendInsertedProducts,
    SendUpdatedProducts as AppSendUpdatedProducts,
    SendDeletedProducts as AppSendDeletedProducts,
    CheckProducts as AppCheckProducts,
    CheckDeletedProducts as AppCheckDeletedProducts
)
from channel_app.core.data import (
    ProductBatchRequestResponseDto,
    ErrorReportDto
)
from omnisdk.omnitron.models import Product, BatchRequest


class SendInsertedProducts(AppSendInsertedProducts):
    param_sync = True

    def get_data(self) -> List[Product]:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[
                                         List[ProductBatchRequestResponseDto],
                                         List[ErrorReportDto],
                                         Any]:
        raise NotImplementedError


class SendUpdatedProducts(AppSendUpdatedProducts):
    param_sync = True

    def get_data(self) -> List[Product]:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[ProductBatchRequestResponseDto,
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class SendDeletedProducts(AppSendDeletedProducts):
    param_sync = True

    def get_data(self) -> List[Product]:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[ProductBatchRequestResponseDto,
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class CheckProducts(AppCheckProducts):

    def get_data(self) -> BatchRequest:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[ProductBatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class CheckDeletedProducts(AppCheckDeletedProducts):

    def get_data(self) -> BatchRequest:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[ProductBatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError
