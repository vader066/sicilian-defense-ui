auth service: 
-login:
  -store access token in local storage.
  -store userData from login response in local storage.
  -return access token and userdata.
-refresh: 
  //refresh token is http-only cookie so it is handled automatically by the backend
  -return access Token.
  -on error Logout.
-getToken:
  -return access token from local storage.
-getUserData: 
 -return userData stored in localStorage.
 -if no data return error.
-logout:
  -remove access token from local storage.
  -remove http only cookie/ make request to backend to invalidate the cookie.
  -setAuthToken to null, set the api interceptor Bearer token to null.


context: AuthContext
useAuthHook: return context AuthContext


AuthProvider Component:
local states - [user, club, authToken(get initial value from local storage)]
useEffects: 
  -On authToken change: 
    -update setAuthToken (global api interceptor token) to new value.
    -setup token refresh every 15 minutes
  -On component mount:
    - run checkAuth

fetchUserData:
  - getUserData - service func to get userdata from local storage
  - setUser - set local state
  - setAuthToken - getToken from local storage and set local authToken state // why?
  - on error return null 

checkAuth:
  -run fetchUserData.
  -on error logout

login:
  - login using service func
  - take return userdata and set local user and token state - I suspect this is redundant and we don't need     do this

logout:
  -call service func logout
  -setUser - null
  -setAuthToken null
  -clear refresh timer

<!-- For refreshing with timer in AuthProvider -->

<!-- useEffect(() => {
  if (!authToken) return;
  if (refreshTimerRef.current) return;

  refreshTimerRef.current = setInterval(
    refreshAuth,
    15 * 60 * 1000
  );

  return () => {
    clearInterval(refreshTimerRef.current!);
    refreshTimerRef.current = null;
  };
}, [authToken]); -->
