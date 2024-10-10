const fs = require('fs/promises');
const path = require('path');

const getAllSignos = async (req, res)=>{
    const signo = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const signosJson = JSON.parse(signo)
    res.json(signosJson);
}

const getOneSigno = async (req, res)=>{
    const oneSigno = req.params.signo;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);
    const result = objSignos[oneSigno];
    res.json(result)
}

const updateSigno = async (req, res)=>{
    const signoEditar = req.params.signoEditar;
    const {textoEditar} = req.body;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);

    const objUpdate = {
        ...objSignos,
        [signoEditar]: textoEditar
    }

    // console.log(objUpdate);
    await fs.writeFile(path.join(__dirname,'../../db/signos.json'), JSON.stringify(objUpdate, null, 2), {encoding: 'utf-8'})

    res.json({
        message: "Updated"
    })
}

const compareLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Rutas de los archivos JSON
        const adminCred = path.resolve(__dirname, '../../db/admin.json');
        const userCred = path.resolve(__dirname, '../../db/user.json');

        // Leer ambos archivos de credenciales
        const adminSoli = await fs.readFile(adminCred, 'utf-8');
        const userSoli = await fs.readFile(userCred, 'utf-8');

        const adminCredentials = JSON.parse(adminSoli);
        const userCredentials = JSON.parse(userSoli);

        // Buscar coincidencias en admin
        const adminUser = adminCredentials.find(c => c.userId.trim() === username.trim() && c.userPass.trim() === password.trim());
        
        // Buscar coincidencias en usuarios regulares
        const normalUser = userCredentials.find(c => c.userId.trim() === username.trim() && c.userPass.trim() === password.trim());

        if (adminUser) {
            return res.json({
                resultado: 'admin'
            });
        } else if (normalUser) {
            return res.json({
                resultado: 'user'
            });
        } else {
            return res.status(401).json({
                resultado: "Credenciales incorrectas"
            });
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({
            resultado: "Error en el servidor"
        });
    }
};


const updatePassword = async (req, res) => {
    const { username, password, newPassword } = req.body; // Recibimos username, password y newPassword
    const adminCred = path.join(__dirname, '../../db/admin.json');
    const userCred = path.join(__dirname, '../../db/user.json');

    try {
        // Leer ambos archivos de usuarios (admin y user)
        const adminSoli = await fs.readFile(adminCred, 'utf-8');
        const userSoli = await fs.readFile(userCred, 'utf-8');
        
        const objAdminSoli = JSON.parse(adminSoli);
        const objUserSoli = JSON.parse(userSoli);

        // Buscar en administradores
        const adminIndex = objAdminSoli.findIndex(user => user.userId === username);
        if (adminIndex !== -1) {
            // Validar si la contraseña actual es correcta en admin
            if (objAdminSoli[adminIndex].userPass !== password) {
                return res.status(401).json({
                    message: "Contraseña incorrecta para admin"
                });
            }

            // Actualizamos la contraseña del admin
            objAdminSoli[adminIndex].userPass = newPassword;

            // Guardamos los cambios en el archivo de admin
            await fs.writeFile(adminCred, JSON.stringify(objAdminSoli, null, 2), { encoding: 'utf-8' });

            return res.json({
                message: "Password de admin ha sido modificado"
            });
        }

        // Buscar en usuarios regulares
        const userIndex = objUserSoli.findIndex(user => user.userId === username);
        if (userIndex !== -1) {
            // Validar si la contraseña actual es correcta en user
            if (objUserSoli[userIndex].userPass !== password) {
                return res.status(401).json({
                    message: "Contraseña incorrecta para usuario"
                });
            }

            // Actualizamos la contraseña del usuario
            objUserSoli[userIndex].userPass = newPassword;

            // Guardamos los cambios en el archivo de usuarios
            await fs.writeFile(userCred, JSON.stringify(objUserSoli, null, 2), { encoding: 'utf-8' });

            return res.json({
                message: "Password de usuario ha sido modificado"
                
            });
            
        }

        // Si no se encontró en ninguno de los archivos
        return res.status(404).json({
            message: "Usuario no encontrado"
        });

    } catch (error) {
        console.error("Error al modificar la contraseña:", error);
        res.status(500).json({
            message: "Error al modificar la contraseña"
        });
    }
};


const addUser = async (req, res) => {
    const { username, password, perfil } = req.body; // Recibimos el username, password y perfil
    let filePath;

    // Determinar el archivo JSON según el perfil
    if (perfil === 'admin') {
        filePath = path.join(__dirname, '../../db/admin.json');
    } else if (perfil === 'user') {
        filePath = path.join(__dirname, '../../db/user.json');
    } else {
        return res.status(400).json({
            message: "Perfil inválido"
        });
    }

    try {
        // Leer el archivo de credenciales correspondiente
        const allUsers = await fs.readFile(filePath, 'utf-8');
        const objUsers = JSON.parse(allUsers);

        // Verificar si el usuario ya existe
        const userExists = objUsers.some(user => user.userId === username);
        if (userExists) {
            return res.status(400).json({
                message: "El usuario ya existe"
            });
        }

        const newUser = {
            userId: username,
            userPass: password,
            perfil: perfil
        };
        objUsers.push(newUser);

        // Guardar los cambios en el archivo JSON correspondiente
        await fs.writeFile(filePath, JSON.stringify(objUsers, null, 2), { encoding: 'utf-8' });

        res.json({
            message: "Usuario creado exitosamente"
        });

    } catch (error) {
        console.error("Error al agregar el usuario:", error);
        res.status(500).json({
            message: "Error al agregar el usuario"
        });
    }
};



module.exports = {
    getAllSignos,
    getOneSigno,
    updateSigno,
    compareLogin,
    updatePassword,
    addUser
}