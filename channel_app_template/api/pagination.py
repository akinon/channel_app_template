from fastapi import Query


class PaginationParams:
    def __init__(
        self,
        limit: int = Query(2, ge=1, le=100),
        offset: int = Query(0, ge=0),
    ):
        self.limit = limit
        self.offset = offset