// routes
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );
  const data = JSON.parse(jsonPayload);
  console.log("decoded first ",data)
  sessionStorage.setItem("role", data?.role)
  sessionStorage.setItem("id", data?.id)

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now();

  // console.log("this is equation", (decoded.exp > (currentTime/1000)));
  
  return decoded.exp > (currentTime/1000);
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();
  console.log("expired", exp);
  console.log("expired", currentTime);

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  // exp in seconds and current time in miliseconds
  const timeLeft = exp - (currentTime/1000);
  console.log("time left", timeLeft);
  // clearTimeout(expiredTimer);

  setTimeout(() => {
    console.log("under the settimeout");
    alert('Token expired here in set Timeout');

    sessionStorage.removeItem('accessToken');

    window.location.href = paths.auth.jwt.login;
  }, timeLeft*1000);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    console.log("here in set session", accessToken);
    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    tokenExpired(exp);
  } else {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('role');
    delete axios.defaults.headers.common.Authorization;
  }
};
