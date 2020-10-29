const helpers = {};
const bcrypt = require('bcryptjs');
helpers.contraIncriptada = async (constrasenia) =>{
    const salt = await bcrypt.genSalt(10);
    const finalContrasenia = await bcrypt.hash(constrasenia, salt);
    return finalContrasenia;
};

helpers.login = async(contrasenia, savePassword) => {
    try {
        return await bcrypt.compare(contrasenia, savePassword);
    } catch (e) {
        console.log(e);
    }
}
module.exports = helpers;