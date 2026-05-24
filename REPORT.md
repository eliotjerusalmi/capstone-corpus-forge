# Project Report

#### The Team members

* eliot jerusalmi, eliot.jerusalmi@epita.fr,eliotjerusalmi
varun Saint Ange, varun.saint-ange@epita.fr,varsa7777
Fathima Gafoor,fathima.gafoor@epita.fr,fathimagafoor2006
---

#### Initial Design

* initial architecture
* assumptions
* technical choices

---

#### Engineering Decisions

For each major decision:

* what alternatives were considered?
* why was this solution chosen?

---

#### Who Did What?

* Document how the project was originally divided among each team member.
* Document how responsibilities possibly evolved over time.

---

#### AI Collaboration

Document how AI tools were used.

* we used ai to make a plan and to help us divide the work in three parts so that we can advance on our parts alone. 
* How did AI influence design and implementation decisions?
* How did AI impact your learning and development process?
* How did you evaluate AI-generated suggestions?
* How did you detect and handle AI errors or limitations?

---

#### Failures and Iterations

Document:

* what failed?
* what surprised you?
* what required redesign?

---

#### “When AI Failed or Was Wrong”

Document cases where AI-generated advice, code, or explanations were:

* incomplete
* misleading
* incorrect
* inefficient

Explain how you detected the issue and how you resolved it.

---

#### Lessons Learned

Reflect on:

* technical growth
* workflow improvements
* Strengths and limitations of AI-assisted development

---

#### Member 3 — Persistence / Testing / Documentation

This area implements a SQLite-backed persistence layer for documents, embeddings, generated artifacts, and token/request tracking. Key files added under `member3_persistence/`:

- `db.py`, `storage.py`, `tracking.py` — core persistence and tracking logic.
- `tests/test_persistence.py` — `pytest` tests validating save/retrieve flows.
- `README.md` and `requirements-member3.txt` — usage and test dependencies.

Design choices: use stdlib `sqlite3` for a lightweight, dependency-free store; JSON-encoded vectors and metadata for portability. Tests focus on reliability and edge-case handling for basic CRUD and tracking flows.

