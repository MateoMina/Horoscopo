import './styles/Form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ callback }) {
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
        fetch(`https://proyecthoroscopoapi.vercel.app/v1/signos/newpass`, {  // Reemplazado con la URL de Vercel
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

    return (
        <form onSubmit={validateUser}>
            <h1 id="txtBienvenida">Bienvenido a nuestro portal del Zodiaco</h1>
            <h4 className="txt">Nombre de Usuario</h4>
            <input type="text" className="entry" onChange={(e) => setUsername(e.target.value)} /><br />
            <h4 className="txt">Contraseña</h4>
            <input type="password" className="entry" onChange={(e) => setPassword(e.target.value)} /><br />
            <input type="submit" value="Ingresar" id="btnEnviar" /><br /><br />

            <button type="button" onClick={() => setIsChangingPassword(true)}>Cambiar Contraseña</button>

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

            <button type="button" onClick={() => setIsCreatingUser(true)}>Crear Nuevo Usuario</button>

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

// Exportación por defecto corregida
export default Form;