import './styles/Form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({callback}) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(''); 
    const [isChangingPassword, setIsChangingPassword] = useState(false); 
    const [newUsername, setNewUsername] = useState(''); // Estado para nuevo usuario
    const [newUserPassword, setNewUserPassword] = useState(''); // Estado para contraseña del nuevo usuario
    const [newUserPerfil, setNewUserPerfil] = useState('user'); // Estado para el perfil del nuevo usuario
    const [isCreatingUser, setIsCreatingUser] = useState(false); // Estado para mostrar/ocultar creación de nuevo usuario
    const goTo = useNavigate();

    const validateUser = (event) => {
        event.preventDefault();
        fetch(`http://localhost:4000/v1/signos/login`, {
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
        fetch(`http://localhost:4000/v1/signos/newpass`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, newPassword }) // Enviamos username, password actual y newPassword
        })
        .then(res => res.json())
        .then(response => {
            if (response.message === "Password ha sido modificado") {
                alert("Contraseña cambiada con éxito");
                setIsChangingPassword(false); // Ocultamos el formulario de cambio de contraseña
                window.location.reload();
            } else {
                alert(response.message); // Mostramos cualquier mensaje de error
                
            }
        })
        .catch(error => {
            console.error("Error al cambiar la contraseña:", error);
            alert("Hubo un error al intentar cambiar la contraseña");
        });
    };

    // Función para crear un nuevo usuario
    const createNewUser = (event) => {
        event.preventDefault();
        fetch(`http://localhost:4000/v1/signos/newuser`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: newUsername, password: newUserPassword, perfil: newUserPerfil })
        })
        .then(res => res.json())
        .then(response => {
            if (response.message === "Usuario creado exitosamente") {
                alert("Usuario creado exitosamente");
                setIsCreatingUser(false); // Ocultar el formulario después de crear el usuario
            } else {
                alert("Error al crear usuario: " + response.message);
            }
        });
    };

    return (
        <form onSubmit={validateUser}>
            <h1 id="txtBienvenida">Bienvenido a nuestro portal del Zodiaco</h1>
            <h4 className="txt">Nombre de Usuario</h4>
            <input type="text" className="entry" onChange={(e) => setUsername(e.target.value)} /><br />
            <h4 className="txt">Contraseña</h4>
            <input type="password" className="entry" onChange={(e) => setPassword(e.target.value)} /><br />
            <input type="submit" value="Ingresar" id="btnEnviar" /><br /><br />

            {/* Botón para mostrar la opción de cambiar contraseña */}
            <button type="button" onClick={() => setIsChangingPassword(true)}>Cambiar Contraseña</button>

            {/* Formulario de cambio de contraseña solo si isChangingPassword es true */}
            {isChangingPassword && (
                <div>
                    <h4 className="txt">Nueva Contraseña</h4>
                    <input
                        type="password"
                        className="entry"
                        onChange={(e) => setNewPassword(e.target.value)}
                    /><br />
                    <br /><br />
                    <button onClick={changePassword}>Guardar Nueva Contraseña</button>
                </div>
            )}

            <br /><br />

            {/* Botón para mostrar la opción de crear nuevo usuario */}
            <button type="button" onClick={() => setIsCreatingUser(true)}>Crear Nuevo Usuario</button>

            {/* Formulario para crear nuevo usuario solo si isCreatingUser es true */}
            {isCreatingUser && (
                <div>
                    <h4 className="txt">Nuevo Nombre de Usuario</h4>
                    <input
                        type="text"
                        className="entry"
                        onChange={(e) => setNewUsername(e.target.value)}
                    /><br />
                    <h4 className="txt">Nueva Contraseña</h4>
                    <input
                        type="password"
                        className="entry"
                        onChange={(e) => setNewUserPassword(e.target.value)}
                    /><br />
                    <h4 className="txt">Perfil</h4>
                    <select className="entry" onChange={(e) => setNewUserPerfil(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select><br />
                    <button onClick={createNewUser}>Crear Usuario</button>
                </div>
            )}
        </form>
    );
}

export default Form;
