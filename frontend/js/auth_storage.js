  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/frontend/pages/quickBook/index.html'; // Redirect to quickBook page
  } else {
    const error = await response.json();
    alert(error.message);
  } 