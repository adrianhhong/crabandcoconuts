let serverUrl = 'http://localhost:5000';
if (process.env.NODE_ENV === 'production') {
  serverUrl = 'https://damp-tor-86645.herokuapp.com:5000 ';
}

export const config = {
  serverUrl,
};
