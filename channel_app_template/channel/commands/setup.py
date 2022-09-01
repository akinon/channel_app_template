from typing import Tuple, Any, List

from channel_app.channel.commands.setup import (
    GetCategoryTreeAndNodes as AppGetCategoryTreeAndNodes,
    GetCategoryAttributes as AppGetCategoryAttributes,
    GetAttributes as AppGetAttributes,
    GetChannelConfSchema as AppGetChannelConfSchema
)
from channel_app.core.data import (
    ErrorReportDto, CategoryTreeDto, CategoryDto, AttributeDto
)


class GetCategoryTreeAndNodes(AppGetCategoryTreeAndNodes):
    def transform_data(self, data) -> Any:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[CategoryTreeDto, ErrorReportDto,
                                              Any]:
        raise NotImplementedError


class GetCategoryAttributes(AppGetCategoryAttributes):

    def get_data(self) -> object:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[CategoryDto, ErrorReportDto,
                                              Any]:
        raise NotImplementedError


class GetAttributes(AppGetAttributes):

    def get_data(self) -> object:
        raise NotImplementedError

    def validated_data(self, data) -> object:
        raise NotImplementedError

    def transform_data(self, data) -> object:
        raise NotImplementedError

    def send_request(self, transformed_data) -> object:
        raise NotImplementedError

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[
        List[AttributeDto], ErrorReportDto, Any]:
        raise NotImplementedError


class GetChannelConfSchema(AppGetChannelConfSchema):

    def normalize_response(self, data, validated_data, transformed_data,
                           response) -> Tuple[dict, Any, Any]:
        raise NotImplementedError
