const express = require('express');
const router = express.Router();

const pool = require('../database'); 
const { isLoggedIn } = require('../lib/auth'); 
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const helpers = require('../lib/helpers');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

// Servicios de Paciente -----------------------------------------------------------------------------------
router.post ('/add',  isLoggedIn, async (req, res) => {
    const { nombres_paciente, apellidos_paciente, fecha_nac, telefono_paciente, codigo_referencia_usuario, nombre_tipo_usuario } = req.body;
    const newPaciente = {
        nombres_paciente,
        apellidos_paciente,
        fecha_nac,
        telefono_paciente,
        codigo_referencia_usuario,
        nombre_tipo_usuario
    };

    const usuarios = { nombre_tipo_usuario }
    await pool.query('INSERT INTO pacientes set ?', [newPaciente]);
    req.flash('success', 'Paciente agregado correctamente');
    res.redirect('/links')
});

router.get ('/',  isLoggedIn,  async (req, res) => {
    const pacientes = await pool.query('SELECT * FROM pacientes');
    console.log(pacientes);
    res.render('links/pacientes', {pacientes})
});

router.get('/delete/:id',  isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM pacientes WHERE codigo_paciente = ?', [id]);
    req.flash('success', 'Paciente Eliminado exitosamente');
    res.redirect('/links')
    console.log(req.params.id);-
    res.send('eliminado')
});

router.get('/edit/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const paciente = await pool.query('SELECT * FROM pacientes WHERE codigo_paciente = ?', [id]);
    res.render('links/editar', {paciente: paciente[0]});
    req.flash('success', 'Paciente actualizado exitosamente');
});

router.post('/edit/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const { nombres_paciente, apellidos_paciente, fecha_nac, telefono_paciente } = req.body;
    const pacienteEditado = {
        nombres_paciente,
        apellidos_paciente,
        fecha_nac,
        telefono_paciente
    };
    await pool.query('UPDATE pacientes set ? WHERE codigo_paciente = ?', [pacienteEditado, id]);
    req.flash('success', 'Paciente actualizado exitosamente');
    res.redirect('/links')
});

router.get ('/fichaTratamiento/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const fichaTratamiento = await pool.query(`SELECT f.codigo_ficha as codigo_ficha, p.codigo_paciente, p.nombres_paciente, p.apellidos_paciente, p.fecha_nac, p.telefono_paciente, m.codigo_medico, m.nombres_medico, m.apellidos_medico, e.codigo_enfermedad, e.nombre_enfermedad, e.tratamiento, c.codigo_clinica, c.nombre_clinica, c.direccion_clinica, c.telefono_clinica FROM ficha_tratamiento f inner join pacientes as p on f.codigo_ficha = p.codigo_ficha inner join medico as m on f.codigo_medico = m.codigo_medico inner join enfermedad as e on f.codigo_enfermedad = e.codigo_enfermedad inner join clinica as c on f.codigo_clinica = c.codigo_clinica WHERE p.codigo_paciente = ${id}`);
    console.log(fichaTratamiento);
    res.render('links/fichaTratamiento', {fichaTratamiento:fichaTratamiento[0]})
});

// Servicios de Medicina -----------------------------------------------------------------------------------

router.get('/medicina/addMedicina', isLoggedIn, async (req, res) => {
    const tipoMedicamentos = await pool.query('SELECT * FROM tipo_medicamento');
    console.log('Los tipos ingresados', tipoMedicamentos);
    res.render('links/medicina/addMedicina', {tipoMedicamentos})
});



router.post ('/medicina/addMedicina', isLoggedIn,  async (req, res) => {
    const { nombre_medicina, tipo_medicina, fecha_ingreso, cantidad} = req.body;
    const newMedicina = {
        nombre_medicina,
        tipo_medicina,
        fecha_ingreso,
        cantidad
    };
    await pool.query('INSERT INTO existencia_medicina set ?', [newMedicina]);
    req.flash('success', 'Medicamento agregado correctamente');
    res.redirect('links/medicina/medicamentos');
});


router.get ('/medicina/medicamentos', isLoggedIn,  async (req, res) => {
    const medicamentos = await pool.query('SELECT * FROM existencia_medicina');
    console.log(medicamentos);
    res.render('links/medicina/medicamentos', {medicamentos})
});

router.get('/medicina/delete/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM existencia_medicina WHERE codigo_stock = ?', [id]);
    req.flash('success', 'Medicamento Agregado exitosamente');
    res.redirect('/links/medicina/medicamentos')
    console.log(req.params.id);-
    res.send('eliminado')
});

router.get('/medicina/editarMed/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const medicina = await pool.query('SELECT * FROM existencia_medicina WHERE codigo_stock = ?', [id]);
    res.render('links/medicina/editarMed', {medicina: medicina[0]});
    req.flash('success', 'Medicamento actualizado exitosamente');
});

router.post('/medicina/editarMed/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const { tipo_medicina, nombre_medicina, cantidad } = req.body;
    const medicamentoEditado = {
        tipo_medicina,
        nombre_medicina,
        cantidad
    };
    await pool.query('UPDATE existencia_medicina set ? WHERE codigo_stock = ?', [medicamentoEditado, id]);
    req.flash('success', 'Medicamento actualizado exitosamente');
    res.redirect('/links/medicina/medicamentos')
});

// Servicios de Medicos ------------------------------------------------------------------------------------------
router.get('/medico/addMedico', isLoggedIn, (req, res) => {
    res.render('links/medico/addMedico');
});

router.post ('/medico/addMedico', isLoggedIn,  async (req, res) => {
    const { nombres_medico, apellidos_medico, codigo_personal, telefono, codigo_usuario_referencia, nombre_tipo_usuario} = req.body;
    const newMedico = {
        nombres_medico,
        apellidos_medico,
        codigo_personal,
        telefono,
        codigo_usuario_referencia,
        nombre_tipo_usuario
    };
    await pool.query('INSERT INTO medico set ?', [newMedico]);
    req.flash('success', 'Medico agregado correctamente');
    res.redirect('/links/medico/medicos');
});

router.get ('/medico/medicos', isLoggedIn,  async (req, res) => {
    const medico = await pool.query('SELECT * FROM medico');
    console.log(medico);
    res.render('links/medico/medicos', {medico})
});

router.get('/medico/delete/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM medico WHERE codigo_medico = ?', [id]);
    req.flash('success', 'Médico Eliminado exitosamente');
    res.redirect('/links/medico/medicos')
    console.log(req.params.id);-
    res.send('eliminado')
});

router.get('/medico/editarMedico/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const medico = await pool.query('SELECT * FROM medico WHERE codigo_medico = ?', [id]);
    res.render('links/medico/editarMedico', {medico: medico[0]});
    req.flash('success', 'Medicamento actualizado exitosamente');
});

router.post('/medico/editarMedico/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const { nombres_medico, apellidos_medico, codigo_personal, telefono } = req.body;
    const medicoEditar = {
        nombres_medico,
        apellidos_medico,
        codigo_personal,
        telefono
    };
    await pool.query('UPDATE medico set ? WHERE codigo_medico = ?', [medicoEditar, id]);
    req.flash('success', 'Medico actualizado exitosamente');
    res.redirect('/links/medico/medicos');
});

var medicoHabitacion;
router.get('/medico/asignarHabitacion/:id', isLoggedIn, (req, res) => {
    res.render('links/medico/asignarHabitacion');
    const { id } = req.params;
    medicoHabitacion = id;
    console.log('El codigo del medico a enviar', medicoHabitacion)
});

router.get ('/medico/verCantidadHabitacionesDisponibles/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    console.log('ver lo que trae la variable', id);
    const piso = await pool.query(`select * from piso where numero_piso = '${id}'`);
    console.log('cantidad de habitaciones', piso);
    const valorHabitaciones = Number (piso[0].cantidad_habitaciones);
    var tamaño = Number(piso.length);
    tamaño = tamaño - 1;
    var valorHabitacionesRestantes = Number(piso[tamaño].cantidad_restante_habitaciones);
    valorHabitacionesRestantes = valorHabitacionesRestantes - 1;
    console.log(valorHabitacionesRestantes);
    piso[0].cantidad_restante_habitaciones = valorHabitacionesRestantes;
    console.log('cantidad de habitaciones luego de restar', valorHabitacionesRestantes);
    console.log(piso)
    console.log('tamaño', tamaño)
    res.render('links/medico/asignarHabitacion' , {piso: piso[0]});
});

router.post ('/medico/asignacion', isLoggedIn,  async (req, res) => {
    const { numero_piso, cantidad_habitaciones, cantidad_restante_habitaciones, codigo_medico_asignado} = req.body;
    const asignacionPiso = {
        numero_piso,
        cantidad_habitaciones,
        cantidad_restante_habitaciones,
        codigo_medico_asignado
    };
    asignacionPiso.codigo_medico_asignado = medicoHabitacion;
    await pool.query('INSERT INTO piso set ?', [asignacionPiso]);
    req.flash('success', 'Información agregada exitosamente');
    res.redirect('/links/medico/medicos');
});

// Catalogos -----------------------------------------------------------------------------------------------
router.post ('/tipoMedicamento', isLoggedIn,  async (req, res) => {
    const { nombre_tipo} = req.body;
    const tipoMedicamento = {
        nombre_tipo
    };
    await pool.query('INSERT INTO tipo_medicamento set ?', [tipoMedicamento]);
    req.flash('success', 'Información agregada exitosamente');
    res.redirect('/links/medico/medicos');
});

router.post ('/enfermedad', isLoggedIn,  async (req, res) => {
    const { nombre_enfermedad, tratamiento} = req.body;
    const enfermedad = {
        nombre_enfermedad,
        tratamiento
    };
    await pool.query('INSERT INTO enfermedad set ?', [enfermedad]);
    req.flash('success', 'Información agregada exitosamente');
    res.redirect('/links/medico/medicos');
});

// Citas-----------------------------------------------------------------------------------------------------

router.get('/agendarCita/:id', isLoggedIn,  async (req, res) => {
        const { id } = req.params;
        const paciente = await pool.query('SELECT * FROM pacientes WHERE codigo_paciente = ?', [id]);
        res.render('links/agendarCita', {paciente: paciente[0]});
});

router.get('/agendarCita', isLoggedIn,  async (req, res) => {
    res.render('links/agendarCita');
});

router.post ('/agendarCita', isLoggedIn,  async (req, res) => {
    const { codigo_paciente, nombres_paciente, apellidos_paciente, fecha_cita} = req.body;
    const agendarCita = {
        codigo_paciente,
        nombres_paciente,
        apellidos_paciente,
        fecha_cita
    };
    await pool.query('INSERT INTO cita_agendada set ?', [agendarCita]);
    req.flash('success', 'Información agregada exitosamente');
    res.redirect('/perfil');
});

router.get ('/verCitasCreadas', isLoggedIn,  async (req, res) => {
    const citasCreadas = await pool.query('select * from cita_agendada WHERE codigo_medico IS NULL');
    console.log(citasCreadas);
    res.render('links/verCitasCreadas', {citasCreadas})
});

var idEnviado;
router.get('/asignarCita/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    console.log('el id que se envia', id);
    idEnviado = id;
    console.log('El id en la variable', idEnviado)
    const cita = await pool.query('SELECT * FROM cita_agendada WHERE codigo_cita = ?', [id]);
    res.render('links/asignarCita', {cita: cita[0]});
});

router.get('/asignarMedico/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const medico = await pool.query('SELECT * FROM medico WHERE codigo_medico = ?', [id]);
    res.render('links/asignarCita', {medico: medico[0]});
});

router.post ('/asignarMedico', isLoggedIn,  async (req, res) => {
    const { codigo_medico, nombres_medico} = req.body;
    const asignarMedico = {
        codigo_medico,
        nombres_medico
    };
    await pool.query(`UPDATE clinica.cita_agendada SET ? WHERE codigo_cita = ${idEnviado}`, [asignarMedico]);
    req.flash('success', 'Información agregada exitosamente');
    res.redirect('/links/verCitasCreadas');
});

router.get ('/verCitasAsignadasMedico', isLoggedIn,  async (req, res) => {
    console.log (req.user.codigo_usuario);
    console.log('El codigo del usuario', req.user.codigo_usuario);

    const citasCreadas = await pool.query(`SELECT c.codigo_cita as codigo_cita, c.nombres_paciente, c.apellidos_paciente, c.fecha_cita, m.codigo_medico, m.nombres_medico FROM cita_agendada c inner join medico as m on m.codigo_medico = c.codigo_medico` );
    console.log(citasCreadas);
    res.render('links/verCitasAsignadasMedico', {citasCreadas})
});


router.get('/asignarCita', isLoggedIn,  async (req, res) => {
    res.render('links/asignarCita');
});

// Usuarios  -------------------------------------------------------------------------------------------------

router.get ('/verUsuariosMedicos', isLoggedIn,  async (req, res) => {
    const usuarios = await pool.query('select u.codigo_usuario as codigo_usuario, u.usuario, u.nombres, u.apellidos, m.nombre_tipo_usuario from usuarios u inner join medico as m on u.codigo_usuario = m.codigo_usuario_referencia;');
    console.log(usuarios);
    res.render('links/verUsuariosMedicos', {usuarios})
});


router.get ('/verUsuariosPacientes', isLoggedIn,  async (req, res) => {
    const usuarios = await pool.query('select u.codigo_usuario as codigo_usuario, u.usuario, u.nombres, u.apellidos, p.nombre_tipo_usuario from usuarios u inner join pacientes as p on u.codigo_usuario = p.codigo_referencia_usuario;');
    console.log(usuarios);
    res.render('links/verUsuariosPacientes', {usuarios})
});

var idUsuario;
router.get('/asignarTipoUsuario/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    idUsuario = id;
    const usuario = await pool.query('SELECT * FROM usuarios WHERE codigo_usuario = ?', [id]);
    console.log(usuario);
    res.render('links/asignarTipoUsuario', {usuario: usuario[0]});
});

router.post ('/asignarTipoUsuario', isLoggedIn,  async (req, res) => {
    const { codigo_tipo_usuario, nombre_tipo_usuario } = req.body;
    const asignarRolUsuario = {
        codigo_tipo_usuario,
        nombre_tipo_usuario
    };
    if (asignarRolUsuario.nombre_tipo_usuario == 'Administrador') {
        asignarRolUsuario.codigo_tipo_usuario = '1';
    }
    if (asignarRolUsuario.nombre_tipo_usuario == 'Médico') {
        asignarRolUsuario.codigo_tipo_usuario = '2';
    }
    await console.log(asignarRolUsuario);
    await pool.query(`UPDATE usuarios SET ? WHERE codigo_usuario = ${idUsuario}`, [asignarRolUsuario]);
    req.flash('success', 'Información agregada exitosamente');
    res.redirect('/links/verUsuarios');
});


router.get ('/buscarUsuario/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    const usuarios = await pool.query('select * from usuarios WHERE codigo_usuario = ?', [id]);
    console.log(usuarios);
    res.render('links/medico/addMedico', {usuarios: usuarios[0]})
});


router.get ('/buscarUsuarioPaciente/:id', isLoggedIn,  async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const usuario = await pool.query('select * from usuarios WHERE codigo_usuario = ?', [id]);
    console.log(usuario);
    res.render('links/add', {usuario: usuario[0]})
});

var idPacienteF;
var idMedicoF;

router.get ('/atenderPaciente/:idPaciente/:idMedico', isLoggedIn,  async (req, res) => {
    const { idPaciente } = req.params;
    const { idMedico } = req.params;
    idPacienteF = idPaciente;
    idMedicoF = idMedico;
    console.log('Id del paciente almacenado', idPacienteF);
    console.log('Id del Medico almacenado', idMedicoF);
    const enfermedades = await pool.query(`select * from enfermedad`);
    console.log(enfermedades);
    res.render('links/atenderPaciente', {enfermedades})
});



module.exports = router