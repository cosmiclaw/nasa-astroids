import * as React from "react";

import axios from "axios";

export const useFetch = (initialQuery, options = { initialFetch: true }) => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const isFirstRender = React.useRef(true);

  async function refetch(query) {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_NEO_ENDPOINT}?${query}&api_key=vcev3RCDZbkaSBn2h02IkxWztKU5hjBAIswhJ4zG`
      );
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  React.useLayoutEffect(() => {
    if (!options.initialFetch && isFirstRender) {
      return;
    }

    (async function () {
      await refetch(initialQuery);
    })();
  }, [initialQuery, options.initialFetch]);

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return { data, error, loading, refetch, setLoading };
};
