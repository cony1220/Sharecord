import { useState, useCallback } from "react";

function useHttp(requestFunction, startWithPending = false, initialData = null) {
  const [isLoading, setIsLoading] = useState(!!startWithPending);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestData) => {
      setIsLoading(true);
      setError(null);

      try {
        const responseData = await requestFunction(requestData);
        setData(responseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [requestFunction],
  );

  return {
    sendRequest,
    data,
    setData,
    isLoading,
    error,
  };
}

export default useHttp;
