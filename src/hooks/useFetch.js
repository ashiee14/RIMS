import { useEffect, useState, useCallback } from "react";

/**
 * Custom Hook for Fetching Data
 * @param {Function} fetchFunction - The async function to fetch data.
 * @param {Array} params - Parameters to pass to the fetch function.
 * @param {Boolean} autoFetch - Whether to fetch automatically on mount.
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (
  fetchFunction,
  params = [],
  autoFetch = true
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!fetchFunction) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(...params);
      setData(result);
    } catch (err) {
      setError(
        err?.message || "An unexpected error occurred while fetching data."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, ...params]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};