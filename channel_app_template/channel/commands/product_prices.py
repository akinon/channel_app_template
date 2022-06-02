from typing import List, Tuple, Any

from channel_app.channel.commands.product_prices import (
    SendUpdatedPrices as AppSendUpdatedPrices,
    SendInsertedPrices as AppSendInsertedPrices,
    CheckPrices as AppCheckPrices,
)
from channel_app.core.data import (
    ErrorReportDto, BatchRequestResponseDto
)
from omnisdk.omnitron.models import BatchRequest, ProductPrice


class SendUpdatedPrices(AppSendUpdatedPrices):
    param_sync = True

    def get_data(self) -> List[ProductPrice]:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[BatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class SendInsertedPrices(AppSendInsertedPrices):
    param_sync = True

    def get_data(self) -> List[ProductPrice]:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[BatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class CheckPrices(AppCheckPrices):

    def get_data(self) -> BatchRequest:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[BatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError
