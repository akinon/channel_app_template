from typing import Tuple, Any, List

from channel_app.channel.commands.product_stocks import (
    SendUpdatedStocks as AppSendUpdatedStocks,
    SendInsertedStocks as AppSendInsertedStocks,
    CheckStocks as AppCheckStocks,
)
from channel_app.core.data import (
    ErrorReportDto, BatchRequestResponseDto
)
from omnisdk.omnitron.models import ProductStock, BatchRequest


class SendUpdatedStocks(AppSendUpdatedStocks):
    param_sync = True

    def get_data(self) -> List[ProductStock]:
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


class SendInsertedStocks(AppSendInsertedStocks):
    param_sync = True

    def get_data(self) -> List[ProductStock]:
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


class CheckStocks(AppCheckStocks):

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
