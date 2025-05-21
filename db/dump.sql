--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4

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
-- Data for Name: LearningObject; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."LearningObject" VALUES ('9b78d542-473f-4924-965b-045193ec4823', 'intro-to-english', '550e8400-e29b-41d4-a716-446655440000', 1, 'en', 'Introduction to English', 'A beginner-friendly learning object for english.', 'text/markdown', NULL, '{12,14}', false, '{https//example.com}', '{"{\"goal\":\"Understand variables\"}"}', '© 2023 Dwengo', 'MIT', 3, 60, '{"callback":"https://example.com"}', true, '2025-05-16 09:19:00.83', '2025-05-16 09:19:00.83', ' ', '{"question":"What is the past tense of ''go''?","options":["Goed","Going","Went","Goes"], "solution":"Went"}', 'MULTIPLE_CHOICE');
INSERT INTO public."LearningObject" VALUES ('e8677867-fa7d-4b47-80fb-d752ab3e9fd3', 'intro-to-english2', 'f1d3ee5f-7b6d-4b27-bfe7-34b6f52c8ab5', 1, 'en', 'Introduction to English', 'A beginner-friendly learning object for english.', 'text/markdown', NULL, '{8,14}', false, '{https//example.com}', '{"{\"goal\":\"Understanding english\"}"}', '© 2023 Dwengo', 'MIT', 3, 60, '{"callback":"https://example.com"}', true, '2025-05-16 09:33:54.053', '2025-05-16 09:33:54.053', ' ', '{"question":"6. Which one is in the past tense?","options":["Go","Ate","Eating","Eats","Went"], "solution":"Ate"}', 'MULTIPLE_CHOICE');
INSERT INTO public."LearningObject" VALUES ('8d3407fd-5446-4240-a3dd-4f08d8d03bf1', 'intro-to-english3', 'f1d3ee5f-7b6d-4b27-bfe7-34b6f52c8ab5', 1, 'en', 'Introduction to English', 'A beginner-friendly learning object for english.', 'text/markdown', NULL, '{8,14}', false, '{https//example.com}', '{"{\"goal\":\"Understanding english\"}"}', '© 2023 Dwengo', 'MIT', 3, 30, '{"callback":"https://example.com"}', true, '2025-05-16 09:39:10.833', '2025-05-16 09:39:10.833', '<div style="font-family: Arial, sans-serif; max-width: 700px; color: #2e3d2f;">
  <h1 style="color: #2e7d32;">Future Tense (Basic English)</h1>
  <p>The <strong style="color: #388e3c;">future tense</strong> is used to talk about something that <strong style="color: #388e3c;">has not happened yet</strong>, but <strong style="color: #388e3c;">will happen later</strong>.</p>
  
  <h2 style="color: #2e7d32;">Structure</h2>
  <p>We usually use <strong style="color: #2e7d32;">"will" + verb</strong> to talk about the future.</p>

  <div style="background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 10px; margin: 10px 0;">
    <p>I <strong>will eat</strong> dinner at 7.</p>
    <p>She <strong>will go</strong> to school tomorrow.</p>
    <p>They <strong>will play</strong> football next week.</p>
  </div>

  <p>You can also use <strong style="color: #2e7d32;">"going to" + verb</strong> for plans:</p>

  <div style="background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 10px; margin: 10px 0;">
    <p>I am <strong>going to visit</strong> my grandma.</p>
    <p>He is <strong>going to study</strong> tonight.</p>
  </div>

  <h2 style="color: #2e7d32;">Common Words for the Future</h2>
  <ul style="padding-left: 20px;">
    <li style="margin-bottom: 4px;">tomorrow</li>
    <li style="margin-bottom: 4px;">next week</li>
    <li style="margin-bottom: 4px;">in two days</li>
    <li style="margin-bottom: 4px;">soon</li>
  </ul>
</div>', NULL, 'READ');
INSERT INTO public."LearningObject" VALUES ('26d49162-94aa-48af-a2cc-b093d32ab2d2', 'intro-to-english4', 'f1d3ee5f-7b6d-4b27-bfe7-34b6f52c8ab5', 1, 'en', 'Introduction to English', 'A beginner-friendly learning object for english.', 'text/markdown', NULL, '{8,14}', false, '{https//example.com}', '{"{\"goal\":\"Understanding english\"}"}', '© 2023 Dwengo', 'MIT', 3, 30, '{"callback":"https://example.com"}', true, '2025-05-16 09:50:27.086', '2025-05-16 09:50:27.086', '<div style="font-family: Arial, sans-serif; max-width: 700px; color: #2e3d2f;">
  <h1 style="color: #2e7d32;">Past Tense (Basic English)</h1>
  <p>The <strong style="color: #388e3c;">past tense</strong> is used to describe something that <strong style="color: #388e3c;">already happened</strong>.</p>

  <h2 style="color: #2e7d32;">Structure</h2>
  <p>We usually add <strong style="color: #2e7d32;">"-ed"</strong> to the verb for regular past tense.</p>

  <div style="background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 10px; margin: 10px 0;">
    <p>I <strong>walked</strong> to the park.</p>
    <p>She <strong>played</strong> the piano.</p>
    <p>They <strong>visited</strong> their friends.</p>
  </div>

  <p>Some verbs are irregular and change form:</p>

  <div style="background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 10px; margin: 10px 0;">
    <p>I <strong>went</strong> to the store.</p>
    <p>He <strong>ate</strong> breakfast early.</p>
    <p>We <strong>saw</strong> a movie.</p>
  </div>

  <h2 style="color: #2e7d32;">Common Words for the Past</h2>
  <ul style="padding-left: 20px;">
    <li style="margin-bottom: 4px;">yesterday</li>
    <li style="margin-bottom: 4px;">last week</li>
    <li style="margin-bottom: 4px;">two days ago</li>
    <li style="margin-bottom: 4px;">in 2020</li>
  </ul>
</div>', NULL, 'READ');
INSERT INTO public."LearningObject" VALUES ('8d6150f1-25e0-4ab2-8940-dc39a01fdf6d', 'intro-to-english5', 'f1d3ee5f-7b6d-4b27-bfe7-34b6f52c8ab5', 1, 'en', 'Introduction to English', 'A beginner-friendly learning object for english.', 'text/markdown', NULL, '{8,14}', false, '{https//example.com}', '{"{\"goal\":\"Understanding english\"}"}', '© 2023 Dwengo', 'MIT', 3, 30, '{"callback":"https://example.com"}', true, '2025-05-16 09:55:30.48', '2025-05-16 09:55:30.48', ' ', '{
  "question": "Choose the correct sentence (Future Tense)",
  "options": [
    "He will goes to work next week.",
    "He going to go to work next week.",
    "He will go to work next week.",
    "He will going to work next week."
  ],
  "solution": "He will go to work next week."
}', 'MULTIPLE_CHOICE');
INSERT INTO public."LearningObject" VALUES ('b4e5b64c-c496-4666-bf31-fc9f53db991a', 'intro-to-english6', 'f1d3ee5f-7b6d-4b27-bfe7-34b6f52c8ab5', 1, 'en', 'Introduction to English', 'A beginner-friendly learning object for english.', 'text/markdown', NULL, '{8,14}', false, '{https//example.com}', '{"{\"goal\":\"Understanding english\"}"}', '© 2023 Dwengo', 'MIT', 3, 30, '{"callback":"https://example.com"}', true, '2025-05-16 10:03:02.72', '2025-05-16 10:03:02.72', ' ', '{"question":"Choose the correct sentence (Past Tense)","options":["I was play football yesterday.","I played football yesterday.","I plays football yesterday.","I was played football yesterday."], "solution":"I played football yesterday."}', 'MULTIPLE_CHOICE');
INSERT INTO public."LearningObject" VALUES ('d383c409-c900-427e-96b3-a37b8675d5d9', 'intro-to-english45', '550e8400-e29b-41d4-a716-446655440000', 1, 'en', 'Introduction to English', 'A beginner-friendly learning object for english.', 'text/markdown', NULL, '{7,14}', false, '{https//example.com}', '{"{\"goal\":\"Understanding english\"}"}', '© 2023 Dwengo', 'MIT', 3, 60, '{"callback":"https://example.com"}', true, '2025-05-16 11:32:09.747', '2025-05-16 11:32:09.747', ' ', NULL, 'FILE');


--
-- Data for Name: LearningPath; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."LearningPath" VALUES ('64821362-eb0c-4404-bb25-c12cea937d60', 'intro-to-english', 'en', 'Introduction to English', 'A beginner-friendly learning path for english.', 'https://static1.bigstockphoto.com/1/0/1/large1500/101825423.jpg', NULL, '2025-05-16 09:10:37.713', '2025-05-16 09:10:37.713');


--
-- Data for Name: LearningPathNode; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."LearningPathNode" VALUES ('143ab601-b4e9-4e58-bd08-9307c88adaa6', '64821362-eb0c-4404-bb25-c12cea937d60', '9b78d542-473f-4924-965b-045193ec4823', 'Complete the exercises in this section.', 0);
INSERT INTO public."LearningPathNode" VALUES ('3001428f-971e-4df4-824f-25d8fc101df4', '64821362-eb0c-4404-bb25-c12cea937d60', 'e8677867-fa7d-4b47-80fb-d752ab3e9fd3', 'Complete the exercises in this section.', 1);
INSERT INTO public."LearningPathNode" VALUES ('f95b9434-b585-4160-b9dc-4053dbf5759c', '64821362-eb0c-4404-bb25-c12cea937d60', '8d3407fd-5446-4240-a3dd-4f08d8d03bf1', 'Read this text about the future tense.', 2);
INSERT INTO public."LearningPathNode" VALUES ('52d4ab49-c706-4d3c-8ae6-f35d5f4c94df', '64821362-eb0c-4404-bb25-c12cea937d60', '26d49162-94aa-48af-a2cc-b093d32ab2d2', 'Read this text about the past tense.', 3);
INSERT INTO public."LearningPathNode" VALUES ('7e822aed-87af-4962-a3fb-d993c5b3a9ce', '64821362-eb0c-4404-bb25-c12cea937d60', '8d6150f1-25e0-4ab2-8940-dc39a01fdf6d', 'Complete the exercises in this section.', 4);
INSERT INTO public."LearningPathNode" VALUES ('b70eb572-2f82-4dae-9686-6945fb68f215', '64821362-eb0c-4404-bb25-c12cea937d60', 'b4e5b64c-c496-4666-bf31-fc9f53db991a', 'Complete the exercises in this section.', 5);
INSERT INTO public."LearningPathNode" VALUES ('bc100a3e-0b1e-41cf-aaf3-886bb68b286c', '64821362-eb0c-4404-bb25-c12cea937d60', 'd383c409-c900-427e-96b3-a37b8675d5d9', 'Submit a file.', 6);


--
-- Data for Name: LearningNodeTransition; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."LearningNodeTransition" VALUES ('32568d8f-948e-4342-8fee-ff1b8b60ea06', '143ab601-b4e9-4e58-bd08-9307c88adaa6', 'answer == ''Went''', 1);
INSERT INTO public."LearningNodeTransition" VALUES ('b45c5fba-58ea-4512-a44f-1e39524c9541', '3001428f-971e-4df4-824f-25d8fc101df4', 'answer == ''Ate''', 2);
INSERT INTO public."LearningNodeTransition" VALUES ('85945773-ac62-4dd8-bd54-413c67e5131f', '3001428f-971e-4df4-824f-25d8fc101df4', 'answer == ''Went''', 3);
INSERT INTO public."LearningNodeTransition" VALUES ('3e6c2714-5744-4655-a0d1-4af1549aea3d', 'f95b9434-b585-4160-b9dc-4053dbf5759c', 'null', 4);
INSERT INTO public."LearningNodeTransition" VALUES ('2798987d-92c8-4c28-977e-90a3bcc38b17', '52d4ab49-c706-4d3c-8ae6-f35d5f4c94df', 'null', 5);
INSERT INTO public."LearningNodeTransition" VALUES ('db165e8f-6684-4b03-9cae-3a065eca418c', '7e822aed-87af-4962-a3fb-d993c5b3a9ce', 'answer == ''He will go to work next week.''', 5);
INSERT INTO public."LearningNodeTransition" VALUES ('c3a80c8f-9ad9-4051-8d04-3cddda218341', 'b70eb572-2f82-4dae-9686-6945fb68f215', 'answer == ''I played football yesterday.''', 6);


--
-- Data for Name: LearningTheme; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."LearningTheme" VALUES ('ca6673f6-8187-4e75-8617-53eb91485e58', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp2316798.jpg&f=1&nofb=1&ipt=3f5a8f03e07710016253b81e146d4650045f7d652a1c2fad377ab20b98a3f09d', 'AI in Climate', '{AI,Climate,Sustainability}');
INSERT INTO public."LearningTheme" VALUES ('ec4b14ab-9d24-4bfd-9dc0-0235ccbefd78', 'https://www.elmens.com/wp-content/uploads/2021/01/Benefits-Of-Learning-A-New-Language-1920x1240.jpg', 'Languages', '{EN,NL,DE,FR,ES,IT,PT,RU,ZH,JA,KO,AR,HI,SV,NO,FI,PL,TR,HE,TH}');


INSERT INTO public."LearningObjectKeyword" VALUES ('8d6150f1-25e0-4ab2-8940-dc39a01fdf6d', 'EN');


--
-- PostgreSQL database dump complete
--

