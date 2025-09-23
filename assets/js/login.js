
const $submit = document.querySelector("#submit"),
    $password = document.querySelector("#password"),
    $username = document.querySelector("#username"),
    $email = document.querySelector("#email"),
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

function login() {
    document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        if ($password.value !== "" && $username.value !== "") {
            e.preventDefault();
            const validUser = "admin";
            const validPass = "1234";

        if ($username.value === validUser && $password.value === validPass) {
            window.location.href = "/index.html";
        } else {
            swal ("Inicio de sesión fallido",
                 "Usuario o contraseña incorrectos", "error");
        }

        } 
    }
});
}

function register() {
    document.addEventListener("click", (e) => {
        if (e.target === $submit){
            e.preventDefault();
            
            if ($username.value.trim() === "" || $email.value.trim() === "") {
                swal ("Registro fallido",
                 "Usuario o correo invalido", "error");
                 return e.preventDefault();
            }
            else if ($password.value.trim() === ""){
                swal ("Registro fallido",
                 "Contraseña invalida", "error");
                 return e.preventDefault();
            }
            else{
                swal ("Registro Exitoso",
                 "Te has registrado correctamente", "success")
                .then(() => {
                    window.location.href = "/index.html";
                });
                const newUser = {
                    username: $username.value.trim(),
                    password: $password.value.trim(),
                    email: $email.value.trim()
                };
            }
        }
    });

}