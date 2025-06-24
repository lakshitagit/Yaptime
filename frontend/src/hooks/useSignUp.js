import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { signup } from '../lib/api'

const useSignUp = () => {
   const queryClient = useQueryClient()
      const {mutate: signupMutation,isPending,error}=useMutation({
          mutationFn: signup,
          onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUsers"]}),
      })
      return {isPending,error,signupMutation}
}

export default useSignUp


