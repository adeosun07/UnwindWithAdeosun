--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2025-08-18 21:22:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 229 (class 1255 OID 98386)
-- Name: create_total_points_entry(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_total_points_entry() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO total_points (username, total_points)
    VALUES (NEW.username, 0);
    RETURN NEW;
END;
$$;


--
-- TOC entry 230 (class 1255 OID 98388)
-- Name: update_total_points(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_total_points() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    total INT;
BEGIN
    -- Safely calculate the sum of points across all games for this username
    SELECT 
        COALESCE((SELECT SUM(points) FROM quiz_points WHERE username = NEW.username), 0) +
        COALESCE((SELECT SUM(points) FROM word_anagram_points WHERE username = NEW.username), 0) +
        COALESCE((SELECT SUM(points) FROM emoji_riddle_points WHERE username = NEW.username), 0) +
        COALESCE((SELECT SUM(points) FROM normal_riddle_points WHERE username = NEW.username), 0) +
        COALESCE((SELECT SUM(points) FROM rps_points WHERE username = NEW.username), 0)
    INTO total;

    -- Insert or update in total_points
    INSERT INTO total_points (username, total_points)
    VALUES (NEW.username, total)
    ON CONFLICT (username)
    DO UPDATE SET total_points = EXCLUDED.total_points;

    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 98416)
-- Name: discussion_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discussion_messages (
    id integer NOT NULL,
    discussion_id integer NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 225 (class 1259 OID 98415)
-- Name: discussion_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discussion_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 225
-- Name: discussion_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discussion_messages_id_seq OWNED BY public.discussion_messages.id;


--
-- TOC entry 224 (class 1259 OID 98406)
-- Name: discussions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discussions (
    id integer NOT NULL,
    title text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 223 (class 1259 OID 98405)
-- Name: discussions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discussions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 223
-- Name: discussions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discussions_id_seq OWNED BY public.discussions.id;


--
-- TOC entry 217 (class 1259 OID 90222)
-- Name: emoji_riddle_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emoji_riddle_points (
    username character varying(50) NOT NULL,
    points integer DEFAULT 0
);


--
-- TOC entry 228 (class 1259 OID 98431)
-- Name: emoji_riddles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emoji_riddles (
    id integer NOT NULL,
    emoji text NOT NULL,
    answer text NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 98430)
-- Name: emoji_riddles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.emoji_riddles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 227
-- Name: emoji_riddles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.emoji_riddles_id_seq OWNED BY public.emoji_riddles.id;


--
-- TOC entry 218 (class 1259 OID 90233)
-- Name: normal_riddle_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.normal_riddle_points (
    username character varying(50) NOT NULL,
    points integer DEFAULT 0
);


--
-- TOC entry 215 (class 1259 OID 90200)
-- Name: quiz_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_points (
    username character varying(50) NOT NULL,
    points integer DEFAULT 0
);


--
-- TOC entry 219 (class 1259 OID 90244)
-- Name: rps_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rps_points (
    username character varying(50) NOT NULL,
    points integer DEFAULT 0
);


--
-- TOC entry 222 (class 1259 OID 98395)
-- Name: shoutouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shoutouts (
    id integer NOT NULL,
    category character varying(20) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT shoutouts_category_check CHECK (((category)::text = ANY ((ARRAY['motivation'::character varying, 'humble'::character varying, 'vent'::character varying])::text[])))
);


--
-- TOC entry 221 (class 1259 OID 98394)
-- Name: shoutouts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shoutouts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3432 (class 0 OID 0)
-- Dependencies: 221
-- Name: shoutouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shoutouts_id_seq OWNED BY public.shoutouts.id;


--
-- TOC entry 220 (class 1259 OID 90255)
-- Name: total_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.total_points (
    username character varying(50) NOT NULL,
    total_points integer DEFAULT 0
);


--
-- TOC entry 214 (class 1259 OID 90195)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 90211)
-- Name: word_anagram_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.word_anagram_points (
    username character varying(50) NOT NULL,
    points integer DEFAULT 0
);


--
-- TOC entry 3228 (class 2604 OID 98419)
-- Name: discussion_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion_messages ALTER COLUMN id SET DEFAULT nextval('public.discussion_messages_id_seq'::regclass);


--
-- TOC entry 3226 (class 2604 OID 98409)
-- Name: discussions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions ALTER COLUMN id SET DEFAULT nextval('public.discussions_id_seq'::regclass);


--
-- TOC entry 3230 (class 2604 OID 98434)
-- Name: emoji_riddles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emoji_riddles ALTER COLUMN id SET DEFAULT nextval('public.emoji_riddles_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 98398)
-- Name: shoutouts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shoutouts ALTER COLUMN id SET DEFAULT nextval('public.shoutouts_id_seq'::regclass);


--
-- TOC entry 3421 (class 0 OID 98416)
-- Dependencies: 226
-- Data for Name: discussion_messages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.discussion_messages VALUES (1, 1, 'Welcome to the avenue for agenda. Let''s cook something jhor!', '2025-08-13 08:39:32.625013');


--
-- TOC entry 3419 (class 0 OID 98406)
-- Dependencies: 224
-- Data for Name: discussions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.discussions VALUES (1, 'welcome', '2025-08-13 08:39:32.618403');


--
-- TOC entry 3412 (class 0 OID 90222)
-- Dependencies: 217
-- Data for Name: emoji_riddle_points; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.emoji_riddle_points VALUES ('newbie_022', 9);


--
-- TOC entry 3423 (class 0 OID 98431)
-- Dependencies: 228
-- Data for Name: emoji_riddles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.emoji_riddles VALUES (44, '🐶⌚', 'watchdog');
INSERT INTO public.emoji_riddles VALUES (45, '💌', 'loveletter');
INSERT INTO public.emoji_riddles VALUES (46, '🌍🏆', 'worldcup');
INSERT INTO public.emoji_riddles VALUES (47, '🔥🛁', 'hottub');
INSERT INTO public.emoji_riddles VALUES (48, '🧠⚡', 'brainstorm');
INSERT INTO public.emoji_riddles VALUES (49, '🥶🧊', 'coldasice');
INSERT INTO public.emoji_riddles VALUES (50, '🐈🛏', 'catnap');
INSERT INTO public.emoji_riddles VALUES (51, '🐴💭', 'horsethought');
INSERT INTO public.emoji_riddles VALUES (52, '🐄🥛', 'cowmilk');
INSERT INTO public.emoji_riddles VALUES (53, '🌙🦉', 'nightowl');
INSERT INTO public.emoji_riddles VALUES (54, '🕷️🧔', 'spiderman');
INSERT INTO public.emoji_riddles VALUES (55, '❤️✉️', 'loveletter');
INSERT INTO public.emoji_riddles VALUES (56, '🍎🥧', 'applepie');
INSERT INTO public.emoji_riddles VALUES (57, '🐶🚔', 'pawpatrol');
INSERT INTO public.emoji_riddles VALUES (58, '🔥🦊', 'firefox');
INSERT INTO public.emoji_riddles VALUES (59, '🌙🌡️', 'nightfever');
INSERT INTO public.emoji_riddles VALUES (60, '🍯🌙', 'honeymoon');
INSERT INTO public.emoji_riddles VALUES (61, '🐰🕳️', 'rathole');
INSERT INTO public.emoji_riddles VALUES (62, '🌶️🐕', 'hotdog');
INSERT INTO public.emoji_riddles VALUES (63, '🌙🚶', 'moonwalk');
INSERT INTO public.emoji_riddles VALUES (64, '🍯🐻', 'honeybear');
INSERT INTO public.emoji_riddles VALUES (65, '🦇👨', 'batman');
INSERT INTO public.emoji_riddles VALUES (66, '🍔👑', 'burgerking');
INSERT INTO public.emoji_riddles VALUES (67, '🐷🏦', 'piggybank');
INSERT INTO public.emoji_riddles VALUES (68, '🙂📘', 'facebook');
INSERT INTO public.emoji_riddles VALUES (69, '🐱💤', 'catnap');
INSERT INTO public.emoji_riddles VALUES (70, '🐝➡️🔙', 'berightback');
INSERT INTO public.emoji_riddles VALUES (71, '👁️4️⃣👁️', 'eyeforaneye');
INSERT INTO public.emoji_riddles VALUES (72, '⚡️🔙', 'flashback');
INSERT INTO public.emoji_riddles VALUES (73, '🇫🇷🍞', 'frenchtoast');
INSERT INTO public.emoji_riddles VALUES (74, '⭐🐟', 'starfish');
INSERT INTO public.emoji_riddles VALUES (75, '1️⃣🔵🌙', 'onceinabluemoon');
INSERT INTO public.emoji_riddles VALUES (76, '🪑⬆️', 'cheerup');
INSERT INTO public.emoji_riddles VALUES (77, '⭐️💵', 'starbucks');
INSERT INTO public.emoji_riddles VALUES (78, '🌎🥤', 'worldcup');
INSERT INTO public.emoji_riddles VALUES (79, '🏠🍭🏠', 'homesweethome');
INSERT INTO public.emoji_riddles VALUES (80, '🧸🐻', 'teddybear');
INSERT INTO public.emoji_riddles VALUES (81, '👋☀️', 'bison');
INSERT INTO public.emoji_riddles VALUES (82, '🚪🚶', 'doorstep');
INSERT INTO public.emoji_riddles VALUES (83, '👱‍♂️👱‍♂️>👱‍♂️', 'twoheadsarebetterthanone');


--
-- TOC entry 3413 (class 0 OID 90233)
-- Dependencies: 218
-- Data for Name: normal_riddle_points; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.normal_riddle_points VALUES ('newbie_022', 9);


--
-- TOC entry 3410 (class 0 OID 90200)
-- Dependencies: 215
-- Data for Name: quiz_points; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quiz_points VALUES ('newbie_022', 2);


--
-- TOC entry 3414 (class 0 OID 90244)
-- Dependencies: 219
-- Data for Name: rps_points; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3417 (class 0 OID 98395)
-- Dependencies: 222
-- Data for Name: shoutouts; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3415 (class 0 OID 90255)
-- Dependencies: 220
-- Data for Name: total_points; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.total_points VALUES ('newbie_022', 20);


--
-- TOC entry 3409 (class 0 OID 90195)
-- Dependencies: 214
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('newbie_022', '$2b$10$Wnfk6OmT8Zk6CdKtJWxyV.jmclyrSP60AeGBcNaxMR7J35GWtLR5O');


--
-- TOC entry 3411 (class 0 OID 90211)
-- Dependencies: 216
-- Data for Name: word_anagram_points; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3433 (class 0 OID 0)
-- Dependencies: 225
-- Name: discussion_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discussion_messages_id_seq', 10, true);


--
-- TOC entry 3434 (class 0 OID 0)
-- Dependencies: 223
-- Name: discussions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discussions_id_seq', 3, true);


--
-- TOC entry 3435 (class 0 OID 0)
-- Dependencies: 227
-- Name: emoji_riddles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.emoji_riddles_id_seq', 83, true);


--
-- TOC entry 3436 (class 0 OID 0)
-- Dependencies: 221
-- Name: shoutouts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shoutouts_id_seq', 5, true);


--
-- TOC entry 3251 (class 2606 OID 98424)
-- Name: discussion_messages discussion_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion_messages
    ADD CONSTRAINT discussion_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 98414)
-- Name: discussions discussions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussions
    ADD CONSTRAINT discussions_pkey PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 90227)
-- Name: emoji_riddle_points emoji_riddle_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emoji_riddle_points
    ADD CONSTRAINT emoji_riddle_points_pkey PRIMARY KEY (username);


--
-- TOC entry 3253 (class 2606 OID 98438)
-- Name: emoji_riddles emoji_riddles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emoji_riddles
    ADD CONSTRAINT emoji_riddles_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 90238)
-- Name: normal_riddle_points normal_riddle_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.normal_riddle_points
    ADD CONSTRAINT normal_riddle_points_pkey PRIMARY KEY (username);


--
-- TOC entry 3235 (class 2606 OID 90205)
-- Name: quiz_points quiz_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_points
    ADD CONSTRAINT quiz_points_pkey PRIMARY KEY (username);


--
-- TOC entry 3243 (class 2606 OID 90249)
-- Name: rps_points rps_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rps_points
    ADD CONSTRAINT rps_points_pkey PRIMARY KEY (username);


--
-- TOC entry 3247 (class 2606 OID 98404)
-- Name: shoutouts shoutouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shoutouts
    ADD CONSTRAINT shoutouts_pkey PRIMARY KEY (id);


--
-- TOC entry 3245 (class 2606 OID 90260)
-- Name: total_points total_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.total_points
    ADD CONSTRAINT total_points_pkey PRIMARY KEY (username);


--
-- TOC entry 3233 (class 2606 OID 90199)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- TOC entry 3237 (class 2606 OID 90216)
-- Name: word_anagram_points word_anagram_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.word_anagram_points
    ADD CONSTRAINT word_anagram_points_pkey PRIMARY KEY (username);


--
-- TOC entry 3261 (class 2620 OID 98387)
-- Name: users trg_create_total_points; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_create_total_points AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_total_points_entry();


--
-- TOC entry 3264 (class 2620 OID 98391)
-- Name: emoji_riddle_points trg_update_emoji; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_emoji AFTER INSERT OR UPDATE ON public.emoji_riddle_points FOR EACH ROW EXECUTE FUNCTION public.update_total_points();


--
-- TOC entry 3262 (class 2620 OID 98389)
-- Name: quiz_points trg_update_quiz; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_quiz AFTER INSERT OR UPDATE ON public.quiz_points FOR EACH ROW EXECUTE FUNCTION public.update_total_points();


--
-- TOC entry 3265 (class 2620 OID 98392)
-- Name: normal_riddle_points trg_update_riddle; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_riddle AFTER INSERT OR UPDATE ON public.normal_riddle_points FOR EACH ROW EXECUTE FUNCTION public.update_total_points();


--
-- TOC entry 3266 (class 2620 OID 98393)
-- Name: rps_points trg_update_rps; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_rps AFTER INSERT OR UPDATE ON public.rps_points FOR EACH ROW EXECUTE FUNCTION public.update_total_points();


--
-- TOC entry 3263 (class 2620 OID 98390)
-- Name: word_anagram_points trg_update_word; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_word AFTER INSERT OR UPDATE ON public.word_anagram_points FOR EACH ROW EXECUTE FUNCTION public.update_total_points();


--
-- TOC entry 3260 (class 2606 OID 98425)
-- Name: discussion_messages discussion_messages_discussion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discussion_messages
    ADD CONSTRAINT discussion_messages_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;


--
-- TOC entry 3256 (class 2606 OID 90228)
-- Name: emoji_riddle_points emoji_riddle_points_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emoji_riddle_points
    ADD CONSTRAINT emoji_riddle_points_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- TOC entry 3257 (class 2606 OID 90239)
-- Name: normal_riddle_points normal_riddle_points_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.normal_riddle_points
    ADD CONSTRAINT normal_riddle_points_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- TOC entry 3254 (class 2606 OID 90206)
-- Name: quiz_points quiz_points_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_points
    ADD CONSTRAINT quiz_points_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- TOC entry 3258 (class 2606 OID 90250)
-- Name: rps_points rps_points_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rps_points
    ADD CONSTRAINT rps_points_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- TOC entry 3259 (class 2606 OID 90261)
-- Name: total_points total_points_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.total_points
    ADD CONSTRAINT total_points_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


--
-- TOC entry 3255 (class 2606 OID 90217)
-- Name: word_anagram_points word_anagram_points_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.word_anagram_points
    ADD CONSTRAINT word_anagram_points_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);


-- Completed on 2025-08-18 21:22:55

--
-- PostgreSQL database dump complete
--

