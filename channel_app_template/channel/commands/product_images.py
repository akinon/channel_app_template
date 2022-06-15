from typing import List, Tuple, Any

from channel_app.channel.commands.product_images import (
    SendUpdatedImages as AppSendUpdatedImages,
    SendInsertedImages as AppSendInsertedImages,
    CheckImages as AppCheckImages,
)
from channel_app.core.data import (
    ErrorReportDto, BatchRequestResponseDto
)
from omnisdk.omnitron.models import ProductImage, BatchRequest


class SendUpdatedImages(AppSendUpdatedImages):
    param_sync = True

    def get_data(self) -> List[ProductImage]:
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


class SendInsertedImages(AppSendInsertedImages):
    param_sync = True

    def get_data(self) -> List[ProductImage]:
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


class CheckImages(AppCheckImages):
    def get_data(self) -> BatchRequest:
        raise NotImplementedError

    def validated_data(self, data):
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[List[BatchRequestResponseDto],
                                              ErrorReportDto, Any]:
        raise NotImplementedError
