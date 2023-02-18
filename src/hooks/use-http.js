import { useState, useCallback } from "react";

function useHttp(requestFunction, startWithPending = false) {
  const [isLoading, setIsLoading] = useState(!!startWithPending);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestData) => {
      setIsLoading(true);
      try {
        const responseData = await requestFunction(requestData);
        setData(responseData);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
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
