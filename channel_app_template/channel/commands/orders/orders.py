from typing import Tuple, Any, List

from channel_app.channel.commands.orders.orders import (
    GetOrders as AppGetOrders,
    SendUpdatedOrders as AppSendUpdatedOrders,
    CheckOrders as AppCheckOrders,
    GetCancelledOrders as AppGetCancelledOrders,
    GetUpdatedOrderItems as AppGetUpdatedOrderItems,
    AppGetCancellationRequests as AppGetCancellationRequests,
    UpdateCancellationRequest as AppUpdateCancellationRequest
)
from omnisdk.omnitron.models import Order, BatchRequest

from channel_app.core.data import (
    ErrorReportDto, ChannelCreateOrderDto, OrderBatchRequestResponseDto,
    CancelOrderDto, ChannelUpdateOrderItemDto, CancellationRequestDto,
    ChannelCancellationRequestDto, BatchRequestResponseDto
)


class GetOrders(AppGetOrders):
    def get_data(self) -> object:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[ChannelCreateOrderDto,
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class SendUpdatedOrders(AppSendUpdatedOrders):
    param_sync = True

    def get_data(self) -> List[Order]:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[OrderBatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class CheckOrders(AppCheckOrders):
    def get_data(self) -> BatchRequest:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data: BatchRequest) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[OrderBatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class GetCancelledOrders(AppGetCancelledOrders):
    def get_data(self) -> BatchRequest:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data: BatchRequest) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[CancelOrderDto,
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class GetUpdatedOrderItems(AppGetUpdatedOrderItems):
    def get_data(self):
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[ChannelUpdateOrderItemDto,
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class GetCancellationRequests(AppGetCancellationRequests):
    def get_data(self):
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise data

    def transform_data(self, data) -> object:
        raise data

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[CancellationRequestDto,
                                              ErrorReportDto, Any]:
        raise NotImplementedError


class UpdateCancellationRequest(AppUpdateCancellationRequest):
    def get_data(self) -> ChannelCancellationRequestDto:
        isinstance(self.objects, ChannelCancellationRequestDto)
        data = self.objects
        return data

    def validated_data(self, data) -> object:
        raise data

    def transform_data(self, data) -> object:
        raise data

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[BatchRequestResponseDto,
                                              ErrorReportDto, Any]:
        raise NotImplementedError