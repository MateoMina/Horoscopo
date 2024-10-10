const validateUser = (event) => {
    event.preventDefault();
    fetch(`https://proyecthoroscopoapi.vercel.app/v1/signos/login`, {  // Reemplazado con la URL de Vercel
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })

    .then(res => res.json())
    .then(responseData => {
        if (responseData.resultado === 'user') {
            callback("user");
            goTo("/userHome");
        } else if (responseData.resultado === 'admin') {
            callback("admin");
            goTo("/adminHome");
        }
    });
};

const changePassword = (event) => {
    event.preventDefault();
    fetch(`https://proyecthoroscopoapi.vercel.app/v1/signos/newpass`, {  // hecho Reemplazado con la URL de Vercel
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, newPassword })
    })
    .then(res => res.json())
    .then(response => {
        if (response.message === "Password ha sido modificado") {
            alert("Contraseña cambiada con éxito");
            setIsChangingPassword(false);
            window.location.reload();
        } else {
            alert(response.message);
        }
    })
    .catch(error => {
        console.error("Error al cambiar la contraseña:", error);
        alert("Hubo un error al intentar cambiar la contraseña");
    });
};

const createNewUser = (event) => {
    event.preventDefault();
    fetch(`https://proyecthoroscopoapi.vercel.app/v1/signos/newuser`, {  // Reemplazado con la URL de Vercel
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newUserPassword, perfil: newUserPerfil })
    })
    .then(res => res.json())
    .then(response => {
        if (response.message === "Usuario creado exitosamente") {
            alert("Usuario creado exitosamente");
            setIsCreatingUser(false);
        } else {
            alert("Error al crear usuario: " + response.message);
        }
    });
};
