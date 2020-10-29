const express = require('express');
const router = express.Router();

const pool = require('../database'); 
const { isLoggedIn } = require('../lib/auth'); 

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

// Servicios de Paciente -----------------------------------------------------------------------------------
router.post ('/add',  isLoggedIn, async (req, res) => {
    const { nombres_paciente, apellidos_paciente, fecha_nac, telefono_paciente } = req.body;
    const newPaciente = {
        nombres_paciente,
        apellidos_paciente,
        fecha_nac,
        telefono_paciente
    };
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
    const fichaTratamiento = await pool.query('SELECT f.codigo_ficha as codigo_ficha, p.codigo_paciente, p.nombres_paciente, p.apellidos_paciente, p.fecha_nac, p.telefono_paciente, m.codigo_medico, m.nombres_medico, m.apellidos_medico, e.codigo_enfermedad, e.nombre_enfermedad, e.tratamiento, c.codigo_clinica, c.nombre_clinica, c.direccion_clinica, c.telefono_clinica FROM ficha_tratamiento f inner join pacientes as p on f.codigo_ficha = p.codigo_ficha inner join medico as m on f.codigo_medico = m.codigo_medico inner join enfermedad as e on f.codigo_enfermedad = e.codigo_enfermedad inner join clinica as c on f.codigo_clinica = c.codigo_clinica;');
    console.log(fichaTratamiento);
    res.render('links/fichaTratamiento', {fichaTratamiento:fichaTratamiento[0]})
});

// Servicios de Medicina -----------------------------------------------------------------------------------

router.get('/medicina/addMedicina', isLoggedIn, (req, res) => {
    res.render('links/medicina/addMedicina');
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
    const { nombres_medico, apellidos_medico, codigo_personal, telefono} = req.body;
    const newMedico = {
        nombres_medico,
        apellidos_medico,
        codigo_personal,
        telefono
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
    res.redirect('/links/medico/medicos')
});

module.exports = router