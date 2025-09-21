const $submit = document.querySelector("#submit"),
    $password = document.querySelector("#password"),
    $username = document.querySelector("#username"),
    $visible = document.querySelector("#visible");

document.addEventListener("change", (e) => {
    if (e.target === $visible) {
        if ($visible.checked === false) {
            $password.type = "password";
        } else {
            $password.type = "text";
        }
    }
});

document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        if ($password.value !== "" && $username.value !== "") {
            e.preventDefault();
            const validUser = "admin";
            const validPass = "1234";

        if ($username.value === validUser && $password.value === validPass) {
            window.location.href = "/index.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }

        } 
    }
});