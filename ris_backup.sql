--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Etat; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Etat" AS ENUM (
    'Célibataire',
    'Marié(e)',
    'Divorcé(e)',
    'Séparé(e)'
);


ALTER TYPE public."Etat" OWNER TO postgres;

--
-- Name: Grade; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Grade" AS ENUM (
    'Professeur',
    'Maître de conférences agrégé',
    'Assistant hospitalo-universitaire',
    'Médecin des hôpitaux'
);


ALTER TYPE public."Grade" OWNER TO postgres;

--
-- Name: Sexe; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Sexe" AS ENUM (
    'Homme',
    'Femme',
    'Autre'
);


ALTER TYPE public."Sexe" OWNER TO postgres;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'Pleins Temps',
    'Conventionnel',
    'Benevole',
    'MI temps'
);


ALTER TYPE public."Status" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Acts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Acts" (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public."Acts" OWNER TO postgres;

--
-- Name: Acts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Acts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Acts_id_seq" OWNER TO postgres;

--
-- Name: Acts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Acts_id_seq" OWNED BY public."Acts".id;


--
-- Name: Encounters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Encounters" (
    id integer NOT NULL,
    patient_id integer,
    "N.Soins" character varying(50) NOT NULL,
    type character varying(50),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    site_id integer,
    created_at timestamp without time zone DEFAULT now(),
    visit_number integer,
    location character varying,
    service character varying
);


ALTER TABLE public."Encounters" OWNER TO postgres;

--
-- Name: Encounters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Encounters_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Encounters_id_seq" OWNER TO postgres;

--
-- Name: Encounters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Encounters_id_seq" OWNED BY public."Encounters".id;


--
-- Name: Etablissement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Etablissement" (
    "Id" integer NOT NULL,
    "Libele" character varying
);


ALTER TABLE public."Etablissement" OWNER TO postgres;

--
-- Name: Etablissement_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Etablissement" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Etablissement_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ExamOrders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExamOrders" (
    id integer NOT NULL,
    clinical_info text,
    remarque text,
    status character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    modality character varying,
    exam_id integer,
    body_part character varying,
    performing_phy_id integer,
    requested_procedure_code character varying,
    tech_id integer
);


ALTER TABLE public."ExamOrders" OWNER TO postgres;

--
-- Name: ExamOrders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ExamOrders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ExamOrders_id_seq" OWNER TO postgres;

--
-- Name: ExamOrders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ExamOrders_id_seq" OWNED BY public."ExamOrders".id;


--
-- Name: Examens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Examens" (
    id integer NOT NULL,
    urgency character varying(20) DEFAULT 'routine'::character varying NOT NULL,
    site_id integer,
    patient_id integer,
    created_at timestamp with time zone DEFAULT now(),
    "Tech_id" integer,
    encounter_id integer,
    med_id integer,
    accession_number character varying,
    status character varying,
    CONSTRAINT chk_exam_urgency CHECK (((urgency)::text = ANY ((ARRAY['routine'::character varying, 'urgent'::character varying, 'stat'::character varying])::text[])))
);


ALTER TABLE public."Examens" OWNER TO postgres;

--
-- Name: Examens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Examens" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Examens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patients" (
    id integer NOT NULL,
    "Nom_et_prénom" character varying(255),
    "Date_de_née" date,
    "Regime_de_PEC" character varying(255),
    "N_carnet" character varying(255),
    "Matricule" character varying(255),
    admission_type character varying,
    created_at timestamp with time zone DEFAULT now(),
    "Téléphone" integer,
    "Etat" public."Etat",
    "Sexe" public."Sexe"
);


ALTER TABLE public."Patients" OWNER TO postgres;

--
-- Name: Patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Patients" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Patients_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Radiologue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Radiologue" (
    "Nom_prenom" character varying,
    a_distance smallint,
    "Id" integer NOT NULL,
    "Site_origine_id" integer,
    "Sexe" public."Sexe",
    "Grade" public."Grade",
    "Status" public."Status"
);


ALTER TABLE public."Radiologue" OWNER TO postgres;

--
-- Name: Radiologue_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Radiologue" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Radiologue_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Rapports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Rapports" (
    id integer NOT NULL,
    clinical_info text,
    technique text,
    resultats text,
    conclusion text,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    signing_radiologist_id integer,
    exam_id integer NOT NULL,
    CONSTRAINT chk_report_status CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'finalized'::character varying, 'signed'::character varying])::text[])))
);


ALTER TABLE public."Rapports" OWNER TO postgres;

--
-- Name: Rapports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Rapports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Rapports_id_seq" OWNER TO postgres;

--
-- Name: Rapports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Rapports_id_seq" OWNED BY public."Rapports".id;


--
-- Name: Salle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Salle" (
    "Id" integer NOT NULL,
    "Libelle" character varying,
    "AE title" character varying,
    "Etablissement_id" integer
);


ALTER TABLE public."Salle" OWNER TO postgres;

--
-- Name: Salle_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Salle" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Salle_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Techniciens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Techniciens" (
    "Id" integer NOT NULL,
    "Nom_prenom" character varying,
    active smallint,
    "Sexe" public."Sexe",
    id_etab integer
);


ALTER TABLE public."Techniciens" OWNER TO postgres;

--
-- Name: Techniciens_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Techniciens" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Techniciens_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    reference_id integer,
    site_origine_id integer,
    created_at timestamp without time zone DEFAULT now(),
    tech_id integer
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: hl7messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hl7messages (
    id integer NOT NULL,
    message_type character varying(20),
    raw_message text,
    received_at timestamp without time zone DEFAULT now(),
    CONSTRAINT chk_hl7_message_type CHECK (((message_type)::text = ANY ((ARRAY['ADT'::character varying, 'ORM'::character varying, 'ORU'::character varying])::text[])))
);


ALTER TABLE public.hl7messages OWNER TO postgres;

--
-- Name: hl7messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hl7messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hl7messages_id_seq OWNER TO postgres;

--
-- Name: hl7messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hl7messages_id_seq OWNED BY public.hl7messages.id;


--
-- Name: Acts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Acts" ALTER COLUMN id SET DEFAULT nextval('public."Acts_id_seq"'::regclass);


--
-- Name: Encounters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Encounters" ALTER COLUMN id SET DEFAULT nextval('public."Encounters_id_seq"'::regclass);


--
-- Name: ExamOrders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamOrders" ALTER COLUMN id SET DEFAULT nextval('public."ExamOrders_id_seq"'::regclass);


--
-- Name: Rapports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rapports" ALTER COLUMN id SET DEFAULT nextval('public."Rapports_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: hl7messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hl7messages ALTER COLUMN id SET DEFAULT nextval('public.hl7messages_id_seq'::regclass);


--
-- Data for Name: Acts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Acts" (id, code, name, created_at, updated_at) FROM stdin;
1	RAD01001	AR TDM Cérébrale	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
2	RAD01002	IRM Cérébrale	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
3	RAD01003	Angio-IRM Cérébrale	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
4	RAD02001	Radiographie Thorax	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
5	RAD02002	Radiographie Thorax de face et profil	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
6	RAD02003	CT Thorax avec contraste	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
7	RAD03001	TDM Abdominale	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
8	RAD03002	IRM Abdomen	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
9	RAD04001	Radiographie Colonne Lombaire	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
10	RAD04002	IRM Colonne Lombaire	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
11	RAD05001	Échographie Abdominale	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
12	RAD05002	Échographie Pelvienne	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
13	RAD06001	Mammographie Bilatérale	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
14	RAD06002	IRM Mammaire	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
15	RAD07001	TDM Sinus	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
16	RAD08001	Radiographie Hanche	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
17	RAD09001	TDM Rénale	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
18	RAD10001	Angiographie Cardiaque	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
19	RAD11001	IRM Cardiaque	2025-09-30 15:48:40.330917	2025-09-30 15:48:40.330917
\.


--
-- Data for Name: Encounters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Encounters" (id, patient_id, "N.Soins", type, start_date, end_date, site_id, created_at, visit_number, location, service) FROM stdin;
3	1	1234	admission	2025-09-01 08:00:00	2025-09-05 14:00:00	1	2025-09-30 12:32:37.09467	\N	\N	\N
4	1	3144	consultation	2025-09-10 10:30:00	2025-09-10 11:00:00	1	2025-09-30 12:32:37.09467	\N	\N	\N
5	2	2222	hospitalisation	2025-08-20 09:00:00	2025-08-25 16:00:00	1	2025-09-30 12:32:37.09467	\N	\N	\N
6	2	4442	consultation	2025-09-12 13:00:00	2025-09-12 13:30:00	1	2025-09-30 12:32:37.09467	\N	\N	\N
7	3	3422	admission	2025-09-15 07:00:00	2025-09-20 12:00:00	2	2025-09-30 12:32:37.09467	\N	\N	\N
8	3	3421	autre	2025-09-25 08:00:00	2025-09-25 09:00:00	2	2025-09-30 12:32:37.09467	\N	\N	\N
\.


--
-- Data for Name: Etablissement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Etablissement" ("Id", "Libele") FROM stdin;
1	Hôpital Charles Nicolle
2	Hôpital La Rabta
3	Hôpital Habib Bourguiba
4	Hôpital Farhat Hached
5	Hôpital Habib Bougatfa
6	Hôpital Militaire Principal
\.


--
-- Data for Name: ExamOrders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamOrders" (id, clinical_info, remarque, status, created_at, modality, exam_id, body_part, performing_phy_id, requested_procedure_code, tech_id) FROM stdin;
30	Patient with chest pain		pending	2025-09-30 12:57:55.736185	\N	\N	\N	\N	\N	\N
31	Routine brain MRI		pending	2025-09-30 12:57:55.736185	\N	\N	\N	\N	\N	\N
32	Knee injury		pending	2025-09-30 12:57:55.736185	\N	\N	\N	\N	\N	\N
33	Follow-up knee X-ray		pending	2025-09-30 12:57:55.736185	\N	\N	\N	\N	\N	\N
35	\N	\N	completed	2025-10-03 13:50:18.762495	CT	\N	\N	\N	\N	\N
38	\N	\N	completed	2025-10-06 10:13:48.07393	CT	\N	\N	\N	\N	\N
39	\N	\N	completed	2025-10-06 10:20:00.977598	CT	\N	\N	\N	\N	\N
40	\N	\N	completed	2025-10-06 10:39:59.498671	IRM	\N	\N	\N	\N	\N
41	\N	\N	completed	2025-10-06 10:48:37.314467		\N	\N	\N	\N	\N
\.


--
-- Data for Name: Examens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Examens" (id, urgency, site_id, patient_id, created_at, "Tech_id", encounter_id, med_id, accession_number, status) FROM stdin;
1	urgent	1	1	2025-08-29 14:44:55.736571+01	1	4	1	1234	completed
2	routine	2	2	2025-09-29 14:44:55.736571+01	2	4	1	1233	pending
3	stat	1	3	2025-09-29 14:44:55.736571+01	3	3	2	1235	completed
4	routine	2	2	2025-09-30 11:03:46.02878+01	1	3	2	1236	completed
9	urgent	1	1	2025-09-29 15:00:00+01	1	3	1	RAD23344	pending
11	urgent	1	1	2025-09-29 15:00:00+01	1	3	1	RAD251003748	pending
12	urgent	1	3	2025-09-29 15:00:00+01	1	4	1	RAD251003451	pending
13	urgent	1	3	2025-09-29 15:00:00+01	1	4	1	RAD251003397	pending
14	urgent	1	3	2025-09-29 15:00:00+01	1	4	1	RAD251003704	pending
15	routine	\N	\N	2025-10-06 10:13:48.07393+01	\N	\N	\N	RAD251006256	pending
16	routine	\N	\N	2025-10-06 10:20:00.977598+01	\N	\N	\N	RAD251006323	pending
17	routine	\N	2	2025-10-06 10:39:59.498671+01	1	4	1	RAD251006148	pending
18	routine	1	3	2025-10-06 10:48:37.314467+01	1	4	1	RAD251006236	pending
\.


--
-- Data for Name: Patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patients" (id, "Nom_et_prénom", "Date_de_née", "Regime_de_PEC", "N_carnet", "Matricule", admission_type, created_at, "Téléphone", "Etat", "Sexe") FROM stdin;
2	Leila Trabelsi	1992-07-10	Privé	789012	MAT002	consultation	2025-09-29 22:14:34.511595+01	87654321	Marié(e)	Femme
3	Mouna Jlassi	1978-11-05	CNSS	345678	MAT003	hospitalisation	2025-09-29 22:14:34.511595+01	13246578	Divorcé(e)	Femme
4	Hichem Zouari	2001-01-17	CNAM	901234	MAT004	admission	2025-09-29 22:14:34.511595+01	87463241	Séparé(e)	Homme
5	Sami Rekik	1969-09-30	Assurance privée	567890	MAT005	autre	2025-09-29 22:14:34.511595+01	24758913	Célibataire	Homme
1	Ahmed Ben Salah	1985-03-22	CNAM	123456	MAT001	admission	2025-09-29 22:14:34.511595+01	12345678	Célibataire	Homme
\.


--
-- Data for Name: Radiologue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Radiologue" ("Nom_prenom", a_distance, "Id", "Site_origine_id", "Sexe", "Grade", "Status") FROM stdin;
Dr. Hichem Ben Youssef	0	1	1	Homme	Professeur	Pleins Temps
Dr. Amina Trabelsi	1	2	2	Femme	Maître de conférences agrégé	Benevole
Dr. Sami Gharbi	0	3	3	Homme	Assistant hospitalo-universitaire	Conventionnel
\.


--
-- Data for Name: Rapports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Rapports" (id, clinical_info, technique, resultats, conclusion, status, signing_radiologist_id, exam_id) FROM stdin;
1	\N	hhhhh	ggggg	kkkkk	draft	1	3
\.


--
-- Data for Name: Salle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Salle" ("Id", "Libelle", "AE title", "Etablissement_id") FROM stdin;
1	Salle Radiologie 1	\N	1
2	Salle Radiologie 2	\N	1
3	Salle Scanner	\N	2
\.


--
-- Data for Name: Techniciens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Techniciens" ("Id", "Nom_prenom", active, "Sexe", id_etab) FROM stdin;
1	Ali Ben Youssef	1	Homme	\N
2	Sana Trabelsi	0	Femme	\N
3	Mohamed Gharbi	0	Homme	\N
4	Imen Saidi	1	Femme	\N
5	Khaled Jebali	0	Homme	\N
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, username, password_hash, role, reference_id, site_origine_id, created_at, tech_id) FROM stdin;
2	testuser	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Radiologue	1	1	2025-09-29 12:14:36.677743	\N
1	admin	$2b$10$.ArmiNbDmN17o6p832qoIuMadd7EigML6YPkbPkext.sY0doRKOEK	professeur	2	1	2020-09-29 00:00:00	\N
\.


--
-- Data for Name: hl7messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hl7messages (id, message_type, raw_message, received_at) FROM stdin;
\.


--
-- Name: Acts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Acts_id_seq"', 19, true);


--
-- Name: Encounters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Encounters_id_seq"', 8, true);


--
-- Name: Etablissement_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Etablissement_Id_seq"', 6, true);


--
-- Name: ExamOrders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ExamOrders_id_seq"', 41, true);


--
-- Name: Examens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Examens_id_seq"', 18, true);


--
-- Name: Patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Patients_id_seq"', 5, true);


--
-- Name: Radiologue_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Radiologue_Id_seq"', 3, true);


--
-- Name: Rapports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Rapports_id_seq"', 1, true);


--
-- Name: Salle_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Salle_Id_seq"', 3, true);


--
-- Name: Techniciens_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Techniciens_Id_seq"', 5, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 2, true);


--
-- Name: hl7messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hl7messages_id_seq', 1, false);


--
-- Name: Acts Acts_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Acts"
    ADD CONSTRAINT "Acts_code_key" UNIQUE (code);


--
-- Name: Acts Acts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Acts"
    ADD CONSTRAINT "Acts_pkey" PRIMARY KEY (id);


--
-- Name: Encounters Encounters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Encounters"
    ADD CONSTRAINT "Encounters_pkey" PRIMARY KEY (id);


--
-- Name: Etablissement Etablissement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Etablissement"
    ADD CONSTRAINT "Etablissement_pkey" PRIMARY KEY ("Id");


--
-- Name: ExamOrders ExamOrders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamOrders"
    ADD CONSTRAINT "ExamOrders_pkey" PRIMARY KEY (id);


--
-- Name: Examens Examens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Examens"
    ADD CONSTRAINT "Examens_pkey" PRIMARY KEY (id);


--
-- Name: Patients Patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_pkey" PRIMARY KEY (id);


--
-- Name: Radiologue Radiologue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Radiologue"
    ADD CONSTRAINT "Radiologue_pkey" PRIMARY KEY ("Id");


--
-- Name: Rapports Rapports_exam_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rapports"
    ADD CONSTRAINT "Rapports_exam_id_key" UNIQUE (exam_id);


--
-- Name: Rapports Rapports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rapports"
    ADD CONSTRAINT "Rapports_pkey" PRIMARY KEY (id);


--
-- Name: Salle Salle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salle"
    ADD CONSTRAINT "Salle_pkey" PRIMARY KEY ("Id");


--
-- Name: Techniciens Techniciens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Techniciens"
    ADD CONSTRAINT "Techniciens_pkey" PRIMARY KEY ("Id");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key" UNIQUE (username);


--
-- Name: hl7messages hl7messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hl7messages
    ADD CONSTRAINT hl7messages_pkey PRIMARY KEY (id);


--
-- Name: Users unique_medecin_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT unique_medecin_user UNIQUE (reference_id);


--
-- Name: Encounters Encounters_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Encounters"
    ADD CONSTRAINT "Encounters_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public."Patients"(id);


--
-- Name: Encounters Encounters_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Encounters"
    ADD CONSTRAINT "Encounters_site_id_fkey" FOREIGN KEY (site_id) REFERENCES public."Etablissement"("Id");


--
-- Name: Examens Examens_Tech_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Examens"
    ADD CONSTRAINT "Examens_Tech_id_fkey" FOREIGN KEY ("Tech_id") REFERENCES public."Techniciens"("Id") NOT VALID;


--
-- Name: Examens Examens_encounter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Examens"
    ADD CONSTRAINT "Examens_encounter_id_fkey" FOREIGN KEY (encounter_id) REFERENCES public."Encounters"(id) NOT VALID;


--
-- Name: Examens Examens_med_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Examens"
    ADD CONSTRAINT "Examens_med_id_fkey" FOREIGN KEY (med_id) REFERENCES public."Radiologue"("Id") NOT VALID;


--
-- Name: Examens Examens_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Examens"
    ADD CONSTRAINT "Examens_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public."Patients"(id);


--
-- Name: Examens Examens_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Examens"
    ADD CONSTRAINT "Examens_site_id_fkey" FOREIGN KEY (site_id) REFERENCES public."Etablissement"("Id");


--
-- Name: Radiologue Radiologue_Site_origine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Radiologue"
    ADD CONSTRAINT "Radiologue_Site_origine_id_fkey" FOREIGN KEY ("Site_origine_id") REFERENCES public."Etablissement"("Id") NOT VALID;


--
-- Name: Salle Salle_Etablissement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Salle"
    ADD CONSTRAINT "Salle_Etablissement_id_fkey" FOREIGN KEY ("Etablissement_id") REFERENCES public."Etablissement"("Id") ON DELETE RESTRICT NOT VALID;


--
-- Name: Techniciens Techniciens_etabl_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Techniciens"
    ADD CONSTRAINT "Techniciens_etabl_fk" FOREIGN KEY (id_etab) REFERENCES public."Etablissement"("Id") NOT VALID;


--
-- Name: Users User_Tech_id_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "User_Tech_id_id_fkey" FOREIGN KEY (tech_id) REFERENCES public."Techniciens"("Id") NOT VALID;


--
-- Name: Users User_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "User_reference_id_fkey" FOREIGN KEY (reference_id) REFERENCES public."Radiologue"("Id") NOT VALID;


--
-- Name: Users User_site_origine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "User_site_origine_id_fkey" FOREIGN KEY (site_origine_id) REFERENCES public."Etablissement"("Id") NOT VALID;


--
-- Name: Rapports fk_report_exam; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rapports"
    ADD CONSTRAINT fk_report_exam FOREIGN KEY (exam_id) REFERENCES public."Examens"(id) ON DELETE CASCADE;


--
-- Name: Rapports fk_report_radiologist; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rapports"
    ADD CONSTRAINT fk_report_radiologist FOREIGN KEY (signing_radiologist_id) REFERENCES public."Users"(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

