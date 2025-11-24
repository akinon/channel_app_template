import { useSearchParams } from 'react-router-dom';

type RequestPaginationParams = {
  limit: number;
  page: number;
};

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

const usePaginationFromQueryParams = (): RequestPaginationParams & {
  syncPaginationWithQueryParams: (pagination: RequestPaginationParams) => void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();

  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : DEFAULT_LIMIT;

  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;

  const syncPaginationWithQueryParams = (
    pagination: RequestPaginationParams
  ) => {
    const queryParams: { [key: string]: string } = {};

    // If values are default, no need to add them to query params.
    if (pagination.limit !== DEFAULT_LIMIT) {
      queryParams['limit'] = pagination.limit.toString();
    }

    if (pagination.page !== DEFAULT_PAGE) {
      queryParams['page'] = pagination.page.toString();
    }

    setSearchParams(queryParams);
  };

  return {
    limit,
    page,
    syncPaginationWithQueryParams
  };
};

export default usePaginationFromQueryParams;
