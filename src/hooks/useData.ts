"use client";
import { useState, useEffect, useCallback } from "react";

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useData<T = any>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
): UseDataState<T> {
  const [state, setState] = useState<Omit<UseDataState<T>, 'refetch'>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await fetchFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "数据获取失败";
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [fetchFunction, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData
  };
}

// 专门用于分页数据的hook
export function usePagination<T = any>(
  fetchFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  limit: number = 10
) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(pageNum, limit);
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "数据获取失败";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, limit]);

  useEffect(() => {
    fetchPage(page);
  }, [fetchPage, page]);

  const nextPage = useCallback(() => {
    if (page * limit < total) {
      setPage(prev => prev + 1);
    }
  }, [page, limit, total]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNum: number) => {
    setPage(pageNum);
  }, []);

  return {
    data,
    total,
    loading,
    error,
    page,
    totalPages: Math.ceil(total / limit),
    nextPage,
    prevPage,
    goToPage,
    refetch: () => fetchPage(page)
  };
}
