import { useState, useEffect } from 'react';
import useRequest from '../../hooks/use-request';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => PerformanceResourceTiming.push('/'),
  });

  useEffect(() => {
    doRequest()
  }, []);

  return <div>Sign Out</div>;
};
