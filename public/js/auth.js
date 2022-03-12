const miFormulario = document.querySelector("form");

const url = "http://localhost:8080/api/auth/";

miFormulario.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const formData = {};
  for (let el of miFormulario.elements) {
    if (el.name.length > 0) formData[el.name] = el.value;
  }

  try {
    const resp = await fetch(url + "login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    const { msg, token } = await resp.json();

    if (msg) {
      return console.error(msg);
    }

    localStorage.setItem("token", token);
    window.location = "chat.html";
  } catch (error) {
    console.error(error);
  }
});

function handleCredentialResponse(response) {
  //Google Token
  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    });
}

const button = document.getElementById("google_signout");

button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("correo"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
