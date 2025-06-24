import React from 'react'
import { getAuthUser } from '../lib/api.js';
import { useQuery } from '@tanstack/react-query';

const useAuthUser = () => {
 
  const authUser= useQuery({
    queryKey: ['authUsers'], //it must be in array
    queryFn: getAuthUser,
    retry:false, //auth check
  });
  return {isLoading:authUser.isLoading, authUser:authUser.data?.user};
}

export default useAuthUser
