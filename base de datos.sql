-- Tabla de Usuarios
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    correo VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    contraseña VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Tabla de Rutinas
CREATE TABLE Rutinas (
    id_rutina INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Ejercicios
CREATE TABLE Ejercicios (
    id_ejercicio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    nivel VARCHAR(50),
    grupo_muscular VARCHAR(50),
    descripcion TEXT,
    imagen_inicial VARCHAR(255),
    imagen_final VARCHAR(255)
) ENGINE=InnoDB;

-- Tabla para la relación entre Rutinas y Ejercicios
CREATE TABLE Rutina_Ejercicio (
    id_rutina_ejercicio INT PRIMARY KEY AUTO_INCREMENT,
    id_rutina INT,
    id_ejercicio INT,
    series INT NOT NULL,
    repeticiones INT NOT NULL,
    FOREIGN KEY (id_rutina) REFERENCES Rutinas(id_rutina) ON DELETE CASCADE,
    FOREIGN KEY (id_ejercicio) REFERENCES Ejercicios(id_ejercicio) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Entrenamientos
CREATE TABLE Entrenamientos (
    id_entrenamiento INT PRIMARY KEY AUTO_INCREMENT,
    id_rutina INT,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_rutina) REFERENCES Rutinas(id_rutina) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla para la relación entre Entrenamientos y Ejercicios
CREATE TABLE Entrenamiento_Detalle (
    id_entrenamiento_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_entrenamiento INT,
    id_ejercicio INT,
    peso DECIMAL(5, 2) NOT NULL,
    serie INT NOT NULL,
    repeticiones INT NOT NULL,
    FOREIGN KEY (id_entrenamiento) REFERENCES Entrenamientos(id_entrenamiento) ON DELETE CASCADE,
    FOREIGN KEY (id_ejercicio) REFERENCES Ejercicios(id_ejercicio) ON DELETE CASCADE
) ENGINE=InnoDB;