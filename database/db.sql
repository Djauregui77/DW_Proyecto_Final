create table piso 
(
	codigo_piso INT NOT NULL AUTO_INCREMENT,
    numero_piso varchar (2),
    cantidad_habitaciones varchar (2),
    cantidad_restante_habitaciones varchar (2),
    codigo_medico_asignado varchar (5),
    primary key (codigo_piso)
);

create table tipo_medicamento 
(
	codigo_tipo INT NOT NULL AUTO_INCREMENT,
    nombre_tipo varchar (100),
    primary key(codigo_tipo)
);

create table habitacion
(
	codigo INT NOT NULL AUTO_INCREMENT,
    numero_habitacion varchar (3),
    piso_habitacion varchar (3),
    PRIMARY KEY (codigo)
);

create table lote_medicina
(
	codigo_lote INT NOT NULL AUTO_INCREMENT,
    nombre_medicina varchar (200),
    fecha_produccion date,
	fecha_caducidad date,
    descripcion_lote varchar (200),
    PRIMARY KEY (codigo_lote)
);

create table existencia_medicina
(
	codigo_stock INT NOT NULL AUTO_INCREMENT,
    tipo_medicina varchar (200),
    nombre_medicina varchar (200),
    fecha_ingreso date,
    cantidad varchar (10),
    codigo_lote varchar(10),
    PRIMARY KEY (codigo_stock),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_codigo_lote FOREIGN KEY (codigo_lote) REFERENCES lote_medicina(codigo_lote)
);

create table enfermedad 
(
	codigo_enfermedad INT NOT NULL AUTO_INCREMENT,
    nombre_enfermedad varchar (200),
    tratamiento varchar (200),
    PRIMARY KEY (codigo_enfermedad),
    CONSTRAINT fk_codigo_enfermedad FOREIGN KEY (codigo_enfermedad) REFERENCES ficha_tratamiento(codigo_enfermedad)
);

create table ficha_tratamiento 
(
	codigo_ficha INT NOT NULL AUTO_INCREMENT,
    codigo_paciente varchar (10),
    codigo_medico varchar (10),
    codigo_enfermedad varchar (10),
    comentario_medico varchar (200),
    PRIMARY KEY (codigo_ficha)
);

create table clinica
(
	codigo_clinica INT NOT NULL AUTO_INCREMENT,
	nombre_clinica varchar (200),
    direccion_clinica varchar (200),
    telefono_clinica varchar (8),
    PRIMARY KEY (codigo_clinica),
    CONSTRAINT fk_codigo_clinica FOREIGN KEY (codigo_clinica) REFERENCES ficha_tratamiento(codigo_clinica)
);

create table personal
(
	codigo_personal INT NOT NULL AUTO_INCREMENT,
    nombre_personal varchar (200),
    apellidos_personal varchar (200),
	PRIMARY KEY (codigo_personal),
    CONSTRAINT fk_codigo_personal FOREIGN KEY (codigo_personal) REFERENCES medico(codigo_personal)
);

create table especialidad
(
	codigo_especialidad INT NOT NULL AUTO_INCREMENT,
    nombre_especialidad varchar (200),
    descripcion_especialidad varchar (200),
    PRIMARY KEY (codigo_especialidad),
    CONSTRAINT fk_codigo_especialidad FOREIGN KEY (codigo_especialidad) REFERENCES medico(codigo_especialidad)
);

create table medico 
(
	codigo_medico INT NOT NULL AUTO_INCREMENT,
    nombres_medico varchar (200),
    apellidos_medico varchar (200),
    codigo_personal varchar (13),
    telefono varchar (8),
    codigo_clinica varchar (10),
    codigo_especialidad varchar (10),
    codigo_usuario_referencia varchar(5),
    nombre_tipo_usuario varchar (20),
    PRIMARY KEY (codigo_medico)
);

create table pacientes
(
	codigo_paciente INT NOT NULL AUTO_INCREMENT,
    nombres_paciente varchar (200),
    apellidos_paciente varchar (200),
    fecha_nac date,
    telefono_paciente varchar (8),
    codigo_medico varchar (10),
    codigo_clinica varchar (10),
    codigo_habitacion varchar (10),
    codigo_ficha varchar (10),
    codigo_referencia_usuario varchar (5),
    nombre_tipo_usuario varchar (20),
    PRIMARY KEY (codigo_paciente),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_codigo_medico FOREIGN KEY (codigo_medico) REFERENCES medico(codigo_medico), 
    CONSTRAINT fk_codigo_clinica FOREIGN KEY (codigo_clinica) REFERENCES clinica(codigo_clinica), 
    CONSTRAINT fk_codigo_ficha FOREIGN KEY (codigo_ficha) REFERENCES ficha_tratamiento(codigo_ficha)
);


create table tipo_usuarios
(
	codigo_tipo_usuario INT NOT NULL AUTO_INCREMENT,
    nombre_tipo_usuario varchar (20),
    PRIMARY KEY (codigo_tipo_usuario)
);

create table usuarios
(
	codigo_usuario INT NOT NULL AUTO_INCREMENT,
    usuario varchar (200),
    contrasenia varchar (200),
    nombres varchar (200),
    apellidos varchar (200),
    codigo_tipo_usuario varchar (5),
    nombre_tipo_usuario varchar (20),
    codigo_clinica varchar (10),
    nombre_clinica varchar (100),
    PRIMARY KEY (codigo_usuario),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_codigo_clinica FOREIGN KEY (codigo_clinica) REFERENCES clinica(codigo_clinica),
    CONSTRAINT fk_codigo_tipo_usuario FOREIGN KEY (codigo_tipo_usuario) REFERENCES tipo_usuarios(codigo_tipo_usuario) 
);

create table cita_agendada
(
	codigo_cita INT NOT NULL AUTO_INCREMENT,
    codigo_paciente varchar (10),
    nombres_paciente varchar (100),
    apellidos_paciente varchar (100),
    fecha_cita date,
    codigo_medico varchar (10),
    nombres_medico varchar (100),
    codigi_usuario varchar (5),
    PRIMARY KEY (codigo_cita),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_codigo_paciente FOREIGN KEY (codigo_paciente) REFERENCES paciente(codigo_paciente),
    CONSTRAINT fk_codigo_medico FOREIGN KEY (codigo_paciente) REFERENCES medico(codigo_medico)
);