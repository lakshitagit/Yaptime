import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnBoardingPage from './pages/OnBoardingPage'
import toast, { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader'

import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {

  //axios 
  //react query tanstack query
  //when you want to fetch some data  from the api to avoid wasting of time we can use useQuery with tanstack to avoid the time taken by the useEffect
  //react router dom
  // why do we need them?
  // const {data:authData,isLoading,error} = useQuery({
  //   queryKey: ['authUsers'], //it must be in array
  //   queryFn: getAuthUser,
  //   retry:false, //auth check
  // });

  const {isLoading, authUser} = useAuthUser();
  const {theme} = useThemeStore();
  // const {theme,setTheme} = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  console.log("Idufobsdui",isAuthenticated);
  
  const isOnboarded = authUser?.isOnboarded
  console.log("auth user details",authUser);
  console.log("odfubvdhfoi",isOnboarded);
  // const authUser = authData?.user;

  if(isLoading) return <PageLoader />


  return (
    <div className='h-screen' data-theme={theme}>
      {/* <button onClick={()=>{setTheme("night")}}>Update to night</button> */}
      <Routes>
      <Route path="/" element={isAuthenticated && isOnboarded === true ? (
        <Layout showSidebar={true}>
          <HomePage />
        </Layout>
      ) : (
        <Navigate to={!isAuthenticated ? "/login" : "/onboarding" } />
      )} />
      <Route path="/signup" element={!isAuthenticated ? (<SignUpPage />) : (
        <Navigate to={isOnboarded ? "/" : "/onboarding"} />
      )} />
      {/* <Routex path="/signup" element={<SignUpPage />} /> */}
      <Route path="/login" element={!isAuthenticated ? (
        <LoginPage />
      ):(
        <Navigate to={isOnboarded ? "/" : "/onboarding"} />
      )} />
      <Route path="/notifications" element={isAuthenticated && isOnboarded ? (
        <Layout showSidebar={true}>
          <NotificationsPage />
        </Layout>
      ):(
        <Navigate to={!isAuthenticated ? "/login":"/onboarding"} />
      )} />
      <Route path="/call" element={isAuthenticated? <CallPage /> : <Navigate to="/login" /> } />
      <Route path="/chat" element={isAuthenticated? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/onboarding" element={isAuthenticated? (
        !isOnboarded ? (
          <OnBoardingPage />
        ) : (
          <Navigate to="/" />
        )
      ):(
        <Navigate to="/login" />
      )} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;


//zustand -- for theme selector
//create a hook with useStre then you can use state anywher ein the application for global state like redux

