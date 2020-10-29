const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, usuario, contrasenia, done ) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario])
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.login(contrasenia, user.contrasenia);
        if (validPassword) {
            done(null, user, req.flash('success','Bienvenido'+ user.usuario));
        } else {
            done(null, false, req.flash('message', 'Contraseña Invalida')); 
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario no existe'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async(req, usuario, contrasenia, done) => {
    
    const { fullname } = req.body;
    const nuevoUsuario = {
        usuario,
        contrasenia,
        fullname
    };
    nuevoUsuario.contrasenia = await helpers.contraIncriptada(contrasenia);
    const result = await pool.query('INSERT INTO usuarios SET ?', [nuevoUsuario]);
    nuevoUsuario.codigo_usuario = result.insertId;
    return done(null, nuevoUsuario)
}));

passport.serializeUser((user, done) =>{
    done(null, user.codigo_usuario);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE codigo_usuario = ?', [id]);
    done(null, rows[0]);
});