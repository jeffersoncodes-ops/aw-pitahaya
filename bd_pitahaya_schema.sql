-- ===================================================
-- PostgreSQL schema for bd_pitahaya
-- Extracted from pg_dump on 2026-06-22
-- Use: psql -U user -d bd_pitahaya -f bd_pitahaya_schema.sql
-- ===================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = 'on';

-- ===================================================
-- FUNCTIONS
-- ===================================================

CREATE FUNCTION public.actualizar_timestamp_accesion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.generar_numero_seguimiento() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    anio VARCHAR(4) := TO_CHAR(CURRENT_DATE, 'YYYY');
    secuencial INTEGER;
BEGIN
    IF NEW.numero_seguimiento IS NULL THEN
        SELECT COALESCE(
            MAX(SUBSTRING(numero_seguimiento FROM '\d+$')::INTEGER), 0
        ) + 1 INTO secuencial
        FROM solicitud
        WHERE numero_seguimiento LIKE 'SOL-' || anio || '-%';

        NEW.numero_seguimiento := 'SOL-' || anio || '-' || LPAD(secuencial::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$_$;

-- ===================================================
-- TABLES
-- ===================================================

CREATE TABLE public.accesion (
    id integer NOT NULL,
    codigo_accesion character varying(20) NOT NULL,
    instcode character varying(10),
    collnumb character varying(20),
    collcode character varying(20),
    genus character varying(50),
    species character varying(50),
    spauthor character varying(100),
    subtaxa character varying(100),
    subtauthor character varying(100),
    cropname character varying(100),
    accename character varying(200),
    acqdate date,
    origcty character(3),
    collsite text,
    provincia character varying(100),
    latitude numeric(9,6),
    longitude numeric(9,6),
    elevation integer,
    colldate date,
    sampstat character varying(50),
    ancest text,
    collsrc character varying(50),
    storage character varying(50),
    remarks text,
    variedad character varying(50),
    tipo_suelo character varying(100),
    tecnico_id integer NOT NULL,
    propietario_id integer NOT NULL,
    donante_id integer,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.detalle_solicitud (
    id integer NOT NULL,
    solicitud_id integer NOT NULL,
    accesion_id integer NOT NULL,
    cantidad integer NOT NULL,
    unidad character varying(20) DEFAULT 'kg'::character varying NOT NULL,
    CONSTRAINT detalle_solicitud_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT detalle_solicitud_unidad_check CHECK (((unidad)::text = ANY ((ARRAY['kg'::character varying, 'lb'::character varying, 'g'::character varying, 'oz'::character varying, 'unidad'::character varying, 'lote'::character varying])::text[])))
);

CREATE TABLE public.deteccion_laboratorio (
    id integer NOT NULL,
    accesion_id integer NOT NULL,
    fitopatogeno_id integer NOT NULL,
    fecha_deteccion date NOT NULL,
    provincia character varying(100),
    variedad character varying(50),
    nivel_incidencia character varying(20),
    metodo_deteccion character varying(100),
    observaciones text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT deteccion_laboratorio_nivel_incidencia_check CHECK (((nivel_incidencia)::text = ANY ((ARRAY['bajo'::character varying, 'medio'::character varying, 'alto'::character varying])::text[])))
);

CREATE TABLE public.donante (
    id integer NOT NULL,
    institucion character varying(200),
    nombre character varying(200),
    numero_accesion character varying(50)
);

CREATE TABLE public.evaluacion_floral (
    id integer NOT NULL,
    planta_id integer NOT NULL,
    longitud_flor_mm numeric(6,2),
    diametro_medio_flor_mm numeric(6,2),
    diametro_basal_flor_mm numeric(6,2),
    peso_flor_g numeric(6,2),
    peso_pedunculo_floral_g numeric(6,2),
    num_brateas_flor integer,
    ancho_brateas_mm numeric(5,2),
    num_petalos integer,
    longitud_petalos_mm numeric(6,2),
    ancho_petalos_mm numeric(5,2),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.evaluacion_fruto (
    id integer NOT NULL,
    planta_id integer NOT NULL,
    forma_fruto integer,
    longitud_fruto_mm numeric(6,2),
    diametro_fruto_mm numeric(6,2),
    peso_fruto_g numeric(7,2),
    num_brateas_fruto integer,
    longitud_brateas_apicales_mm numeric(6,2),
    ancho_mamila_mm numeric(5,2),
    largo_mamila_mm numeric(5,2),
    color_cascara character varying(50),
    espesor_cascara_mm numeric(5,2),
    peso_cascara_g numeric(6,2),
    peso_pulpa_g numeric(6,2),
    color_pulpa character varying(50),
    relacion_cascara_pulpa numeric(5,2),
    solidos_solubles_brix numeric(4,1),
    acidez_titulable_pct numeric(5,2),
    longitud_semilla_mm numeric(5,2),
    ancho_semilla_mm numeric(5,2),
    tamano_promedio_semilla_mm numeric(5,2),
    peso_semillas_por_fruto_g numeric(6,2),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT evaluacion_fruto_forma_fruto_check CHECK (((forma_fruto >= 1) AND (forma_fruto <= 3)))
);

CREATE TABLE public.evaluacion_sanidad (
    id integer NOT NULL,
    planta_id integer NOT NULL,
    presencia_raices_aereas boolean,
    presencia_patogenos_basales boolean,
    dano_mecanico_microbiano boolean,
    presencia_clorosis boolean,
    rajadura_fruto boolean,
    severidad_enfermedad integer,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT evaluacion_sanidad_severidad_enfermedad_check CHECK (((severidad_enfermedad >= 1) AND (severidad_enfermedad <= 3)))
);

CREATE TABLE public.evaluacion_vegetativa (
    id integer NOT NULL,
    planta_id integer NOT NULL,
    num_cladodios_vegetativos integer,
    longitud_cladodio_cm numeric(6,2),
    ancho_cladodio_cm numeric(5,2),
    num_aristas integer,
    altura_arista_mm numeric(5,2),
    espesor_arista_mm numeric(5,2),
    longitud_costilla_cm numeric(5,2),
    ancho_costilla_mm numeric(5,2),
    margen_costilla integer,
    distancia_areolas_mm numeric(5,2),
    altura_areola_mm numeric(5,2),
    num_espinas_por_areola integer,
    longitud_espina_mm numeric(5,2),
    ancho_espina_mm numeric(5,2),
    presencia_cera boolean,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT evaluacion_vegetativa_margen_costilla_check CHECK (((margen_costilla >= 1) AND (margen_costilla <= 3)))
);

CREATE TABLE public.fitopatogeno (
    id integer NOT NULL,
    nombre_cientifico character varying(200) NOT NULL,
    nombre_comun character varying(200),
    tipo character varying(50),
    sintomas text,
    condiciones_propagacion text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fitopatogeno_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['bacteria'::character varying, 'hongo'::character varying, 'virus'::character varying, 'nematodo'::character varying, 'otro'::character varying])::text[])))
);

CREATE TABLE public.fotografia (
    id integer NOT NULL,
    entidad_tipo character varying(50) NOT NULL,
    entidad_id integer NOT NULL,
    url character varying(255) NOT NULL,
    descripcion text,
    es_principal boolean DEFAULT false,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.inventario_almacen (
    id integer NOT NULL,
    accesion_id integer NOT NULL,
    codigo_ubicacion character varying(50) NOT NULL,
    cantidad_disponible integer NOT NULL,
    fecha_ingreso date NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    unidad character varying(20) DEFAULT 'libras'::character varying NOT NULL,
    CONSTRAINT inventario_almacen_cantidad_disponible_check CHECK ((cantidad_disponible >= 0))
);

CREATE TABLE public.noticia (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    contenido text NOT NULL,
    foto_url character varying(255),
    fecha_publicacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true
);

CREATE TABLE public.planta (
    id integer NOT NULL,
    accesion_id integer NOT NULL,
    codigo_planta character varying(30) NOT NULL
);

CREATE TABLE public.producto_procesado (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    tipo character varying(50),
    descripcion text,
    proceso_obtencion text,
    ingredientes text,
    fotografia_url character varying(255),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT producto_procesado_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['vino'::character varying, 'licor'::character varying, 'mermelada'::character varying, 'harina'::character varying, 'aceite'::character varying, 'otro'::character varying])::text[])))
);

CREATE TABLE public.propietario (
    id integer NOT NULL,
    nombre_productor character varying(200) NOT NULL,
    cedula character varying(20),
    celular character varying(20),
    nombre_finca character varying(200),
    cultivo_variedad character varying(100)
);

CREATE TABLE public.solicitud (
    id integer NOT NULL,
    solicitante_nombre character varying(200) NOT NULL,
    solicitante_email character varying(200) NOT NULL,
    solicitante_telefono character varying(20),
    solicitante_cedula character varying(20),
    solicitante_finca character varying(200),
    solicitante_direccion text,
    numero_seguimiento character varying(20),
    fecha_solicitud timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    admin_id integer,
    observaciones text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT solicitud_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aprobada'::character varying, 'rechazada'::character varying, 'entregada'::character varying])::text[])))
);

CREATE TABLE public.tecnico (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    correo character varying(200),
    cargo character varying(100),
    celular character varying(20),
    lugar character varying(200)
);

CREATE TABLE public.tratamiento (
    id integer NOT NULL,
    fitopatogeno_id integer NOT NULL,
    nombre_tratamiento character varying(200) NOT NULL,
    tipo_tratamiento character varying(50),
    descripcion text,
    dosis character varying(100),
    frecuencia character varying(100),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tratamiento_tipo_tratamiento_check CHECK (((tipo_tratamiento)::text = ANY ((ARRAY['quimico'::character varying, 'biologico'::character varying, 'cultural'::character varying, 'integrado'::character varying])::text[])))
);

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(20) NOT NULL,
    activo boolean DEFAULT true,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    telefono character varying(20),
    cedula character varying(20),
    finca character varying(200),
    direccion text,
    CONSTRAINT usuario_rol_check CHECK (((rol)::text = ANY ((ARRAY['admin'::character varying, 'investigador'::character varying, 'agricultor'::character varying])::text[])))
);

-- ===================================================
-- SEQUENCES
-- ===================================================

CREATE SEQUENCE public.accesion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.detalle_solicitud_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.deteccion_laboratorio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.donante_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.evaluacion_floral_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.evaluacion_fruto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.evaluacion_sanidad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.evaluacion_vegetativa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.fitopatogeno_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.fotografia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.inventario_almacen_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.noticia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.planta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.producto_procesado_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.propietario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.solicitud_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.tecnico_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.tratamiento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ===================================================
-- COLUMN DEFAULTS (auto-increment via sequences)
-- ===================================================

ALTER TABLE ONLY public.accesion ALTER COLUMN id SET DEFAULT nextval('public.accesion_id_seq'::regclass);
ALTER TABLE ONLY public.detalle_solicitud ALTER COLUMN id SET DEFAULT nextval('public.detalle_solicitud_id_seq'::regclass);
ALTER TABLE ONLY public.deteccion_laboratorio ALTER COLUMN id SET DEFAULT nextval('public.deteccion_laboratorio_id_seq'::regclass);
ALTER TABLE ONLY public.donante ALTER COLUMN id SET DEFAULT nextval('public.donante_id_seq'::regclass);
ALTER TABLE ONLY public.evaluacion_floral ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_floral_id_seq'::regclass);
ALTER TABLE ONLY public.evaluacion_fruto ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_fruto_id_seq'::regclass);
ALTER TABLE ONLY public.evaluacion_sanidad ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_sanidad_id_seq'::regclass);
ALTER TABLE ONLY public.evaluacion_vegetativa ALTER COLUMN id SET DEFAULT nextval('public.evaluacion_vegetativa_id_seq'::regclass);
ALTER TABLE ONLY public.fitopatogeno ALTER COLUMN id SET DEFAULT nextval('public.fitopatogeno_id_seq'::regclass);
ALTER TABLE ONLY public.fotografia ALTER COLUMN id SET DEFAULT nextval('public.fotografia_id_seq'::regclass);
ALTER TABLE ONLY public.inventario_almacen ALTER COLUMN id SET DEFAULT nextval('public.inventario_almacen_id_seq'::regclass);
ALTER TABLE ONLY public.noticia ALTER COLUMN id SET DEFAULT nextval('public.noticia_id_seq'::regclass);
ALTER TABLE ONLY public.planta ALTER COLUMN id SET DEFAULT nextval('public.planta_id_seq'::regclass);
ALTER TABLE ONLY public.producto_procesado ALTER COLUMN id SET DEFAULT nextval('public.producto_procesado_id_seq'::regclass);
ALTER TABLE ONLY public.propietario ALTER COLUMN id SET DEFAULT nextval('public.propietario_id_seq'::regclass);
ALTER TABLE ONLY public.solicitud ALTER COLUMN id SET DEFAULT nextval('public.solicitud_id_seq'::regclass);
ALTER TABLE ONLY public.tecnico ALTER COLUMN id SET DEFAULT nextval('public.tecnico_id_seq'::regclass);
ALTER TABLE ONLY public.tratamiento ALTER COLUMN id SET DEFAULT nextval('public.tratamiento_id_seq'::regclass);
ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);

-- ===================================================
-- CONSTRAINTS (Primary Keys, Foreign Keys, Unique)
-- ===================================================

ALTER TABLE ONLY public.accesion
    ADD CONSTRAINT accesion_codigo_accesion_key UNIQUE (codigo_accesion);

ALTER TABLE ONLY public.accesion
    ADD CONSTRAINT accesion_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.detalle_solicitud
    ADD CONSTRAINT detalle_solicitud_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.deteccion_laboratorio
    ADD CONSTRAINT deteccion_laboratorio_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.donante
    ADD CONSTRAINT donante_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.evaluacion_floral
    ADD CONSTRAINT evaluacion_floral_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.evaluacion_floral
    ADD CONSTRAINT evaluacion_floral_planta_id_key UNIQUE (planta_id);

ALTER TABLE ONLY public.evaluacion_fruto
    ADD CONSTRAINT evaluacion_fruto_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.evaluacion_fruto
    ADD CONSTRAINT evaluacion_fruto_planta_id_key UNIQUE (planta_id);

ALTER TABLE ONLY public.evaluacion_sanidad
    ADD CONSTRAINT evaluacion_sanidad_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.evaluacion_sanidad
    ADD CONSTRAINT evaluacion_sanidad_planta_id_key UNIQUE (planta_id);

ALTER TABLE ONLY public.evaluacion_vegetativa
    ADD CONSTRAINT evaluacion_vegetativa_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.evaluacion_vegetativa
    ADD CONSTRAINT evaluacion_vegetativa_planta_id_key UNIQUE (planta_id);

ALTER TABLE ONLY public.fitopatogeno
    ADD CONSTRAINT fitopatogeno_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fotografia
    ADD CONSTRAINT fotografia_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.inventario_almacen
    ADD CONSTRAINT inventario_almacen_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.noticia
    ADD CONSTRAINT noticia_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.planta
    ADD CONSTRAINT planta_accesion_id_codigo_planta_key UNIQUE (accesion_id, codigo_planta);

ALTER TABLE ONLY public.planta
    ADD CONSTRAINT planta_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.producto_procesado
    ADD CONSTRAINT producto_procesado_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.propietario
    ADD CONSTRAINT propietario_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.solicitud
    ADD CONSTRAINT solicitud_numero_seguimiento_key UNIQUE (numero_seguimiento);

ALTER TABLE ONLY public.solicitud
    ADD CONSTRAINT solicitud_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tecnico
    ADD CONSTRAINT tecnico_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.tratamiento
    ADD CONSTRAINT tratamiento_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);

-- Foreign Keys

ALTER TABLE ONLY public.accesion
    ADD CONSTRAINT accesion_donante_id_fkey FOREIGN KEY (donante_id) REFERENCES public.donante(id);

ALTER TABLE ONLY public.accesion
    ADD CONSTRAINT accesion_propietario_id_fkey FOREIGN KEY (propietario_id) REFERENCES public.propietario(id);

ALTER TABLE ONLY public.accesion
    ADD CONSTRAINT accesion_tecnico_id_fkey FOREIGN KEY (tecnico_id) REFERENCES public.tecnico(id);

ALTER TABLE ONLY public.detalle_solicitud
    ADD CONSTRAINT detalle_solicitud_accesion_id_fkey FOREIGN KEY (accesion_id) REFERENCES public.accesion(id);

ALTER TABLE ONLY public.detalle_solicitud
    ADD CONSTRAINT detalle_solicitud_solicitud_id_fkey FOREIGN KEY (solicitud_id) REFERENCES public.solicitud(id);

ALTER TABLE ONLY public.deteccion_laboratorio
    ADD CONSTRAINT deteccion_laboratorio_accesion_id_fkey FOREIGN KEY (accesion_id) REFERENCES public.accesion(id);

ALTER TABLE ONLY public.deteccion_laboratorio
    ADD CONSTRAINT deteccion_laboratorio_fitopatogeno_id_fkey FOREIGN KEY (fitopatogeno_id) REFERENCES public.fitopatogeno(id);

ALTER TABLE ONLY public.evaluacion_floral
    ADD CONSTRAINT evaluacion_floral_planta_id_fkey FOREIGN KEY (planta_id) REFERENCES public.planta(id);

ALTER TABLE ONLY public.evaluacion_fruto
    ADD CONSTRAINT evaluacion_fruto_planta_id_fkey FOREIGN KEY (planta_id) REFERENCES public.planta(id);

ALTER TABLE ONLY public.evaluacion_sanidad
    ADD CONSTRAINT evaluacion_sanidad_planta_id_fkey FOREIGN KEY (planta_id) REFERENCES public.planta(id);

ALTER TABLE ONLY public.evaluacion_vegetativa
    ADD CONSTRAINT evaluacion_vegetativa_planta_id_fkey FOREIGN KEY (planta_id) REFERENCES public.planta(id);

ALTER TABLE ONLY public.inventario_almacen
    ADD CONSTRAINT inventario_almacen_accesion_id_fkey FOREIGN KEY (accesion_id) REFERENCES public.accesion(id);

ALTER TABLE ONLY public.noticia
    ADD CONSTRAINT noticia_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);

ALTER TABLE ONLY public.planta
    ADD CONSTRAINT planta_accesion_id_fkey FOREIGN KEY (accesion_id) REFERENCES public.accesion(id);

ALTER TABLE ONLY public.solicitud
    ADD CONSTRAINT solicitud_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.usuario(id);

ALTER TABLE ONLY public.tratamiento
    ADD CONSTRAINT tratamiento_fitopatogeno_id_fkey FOREIGN KEY (fitopatogeno_id) REFERENCES public.fitopatogeno(id);

-- ===================================================
-- INDEXES
-- ===================================================

CREATE INDEX idx_accesion_fts ON public.accesion USING gin (to_tsvector('spanish'::regconfig, (((((((((((((((((COALESCE(codigo_accesion, ''::character varying))::text || ' '::text) || (COALESCE(accename, ''::character varying))::text) || ' '::text) || (COALESCE(cropname, ''::character varying))::text) || ' '::text) || (COALESCE(genus, ''::character varying))::text) || ' '::text) || (COALESCE(species, ''::character varying))::text) || ' '::text) || (COALESCE(provincia, ''::character varying))::text) || ' '::text) || COALESCE(collsite, ''::text)) || ' '::text) || (COALESCE(variedad, ''::character varying))::text) || ' '::text) || COALESCE(remarks, ''::text))));

CREATE INDEX idx_accesion_genus ON public.accesion USING btree (genus);

CREATE INDEX idx_accesion_provincia ON public.accesion USING btree (provincia);

CREATE INDEX idx_accesion_variedad ON public.accesion USING btree (variedad);

CREATE INDEX idx_detalle_solicitud_accesion ON public.detalle_solicitud USING btree (accesion_id);

CREATE INDEX idx_detalle_solicitud_solicitud ON public.detalle_solicitud USING btree (solicitud_id);

CREATE INDEX idx_deteccion_accesion ON public.deteccion_laboratorio USING btree (accesion_id);

CREATE INDEX idx_deteccion_fitopatogeno ON public.deteccion_laboratorio USING btree (fitopatogeno_id);

CREATE INDEX idx_deteccion_provincia ON public.deteccion_laboratorio USING btree (provincia);

CREATE INDEX idx_fotografia_entidad ON public.fotografia USING btree (entidad_tipo, entidad_id);

CREATE INDEX idx_inventario_accesion ON public.inventario_almacen USING btree (accesion_id);

CREATE INDEX idx_noticia_fecha ON public.noticia USING btree (fecha_publicacion DESC);

CREATE INDEX idx_planta_accesion ON public.planta USING btree (accesion_id);

CREATE INDEX idx_solicitud_estado ON public.solicitud USING btree (estado);

CREATE INDEX idx_solicitud_numero_seguimiento ON public.solicitud USING btree (numero_seguimiento);

CREATE INDEX idx_tratamiento_fitopatogeno ON public.tratamiento USING btree (fitopatogeno_id);

-- ===================================================
-- TRIGGERS
-- ===================================================

CREATE TRIGGER trigger_accesion_actualizado BEFORE UPDATE ON public.accesion FOR EACH ROW EXECUTE FUNCTION public.actualizar_timestamp_accesion();

CREATE TRIGGER trigger_solicitud_numero BEFORE INSERT ON public.solicitud FOR EACH ROW EXECUTE FUNCTION public.generar_numero_seguimiento();
