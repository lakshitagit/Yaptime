import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';
import ThemeSelector from './ThemeSelector';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
    const {authUser} = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    console.log("Profile picture ",authUser.profilePic);
    
    // const queryClient = useQueryClient();
    // const {mutate:logoutMutation,isPending,error}=useMutation({
    //     mutationFn: logout,
    //     onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUsers"]})
    // })

    const {logoutMutation} = useLogout();
  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
        <div className='container mx-auto px-4 sm:px-8'>
            <div className='flex items-center justify-end w-full'>
                {/* display logo only if you are on chat page */}
                {isChatPage && (
                    <div className='pl-5'>
                        <Link to="/" className='flex items-center gap-2.5'>
                        <ShipWheelIcon className='size-9 text-primary' />
                        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                            Yaptime
                        </span>
                        </Link>
                    </div>
                )}
                <div className='flex items-center gap-3 sm:gap-4'>
                    <Link to={"/notifications"}>
                    <button className='btn btn-ghost btn-circle'>
                        <BellIcon className='h-6 w-6 text-base-content opacity-70' />
                    </button>
                    </Link>
                </div>

                <ThemeSelector />

                <div className='avatar'> 
                    <div className='w-9 rounded-full'>
                        <img src={authUser?.profilePic} alt='USER AVATAR' rel='noreferrer'/>
                    </div>
                </div>

                <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
                    <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                </button>



            </div>
        </div>
    </nav>
  )
}

export default Navbar;
