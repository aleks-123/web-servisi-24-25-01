const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/login',
      data: {
        email,
        password,
      },
    });
    window.location.href = '/viewmovies';
  } catch (err) {
    console.log(err.message);
  }
};

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
