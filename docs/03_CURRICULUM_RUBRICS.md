# 03: CURRICULUM & DETERMINISTIC GRADING RUBRICS — UNCLE DRILL

**Version:** 1.0 (Production Specification)  
**Database Mapping:** Splits into `curriculum_public` (Mental Models, Industry Stories, Docs, Project Briefs) and `audit_rubrics_private` (Deterministic Bash/Test Assertions, Task Mutations, Must-Knows, May-Knows).

---

## 1. How the 3-Gate Audit Engine Executes Every Milestone

Every milestone in Uncle Drill is evaluated through a strict 3-Gate State Machine:

1. **Gate 1: Deterministic Sandbox Pre-Check (Zero LLM Cost)**
   * Runs isolated shell assertions (`exit_code`, `pytest`, `ruff check`, `mypy --strict`, `git status`, `EXPLAIN (FORMAT JSON)`).
   * If Gate 1 fails, `passed_gate_1 = false`. The user is blocked from the theoretical defense and receives an immediate diagnostic roast.
2. **Gate 2: Parameterized Live Sandbox Task (Anti-Collusion)**
   * The engine selects 1 of 3 randomized task variants (`variant_seed`) and mutates the sandbox files (e.g., injecting corrupt log lines, detaching `HEAD`, or introducing a race condition).
   * Telemetry logs every command typed, exit code, and `man` page lookup into the 5KB JSON buffer.
3. **Gate 3: Uncle Drill Socratic Defense (`Must-Know` vs. `May-Know`)**
   * **Must-Know Rubric (2 to 3 Core Questions):** Tests the fundamental mental model. Failing any Must-Know fails the drill.
   * **May-Know Rubric (1 to 2 Principal Stretch Questions):** Tests deep internals. Passing awards a `+20%` Grit XP bonus; failing logs the concept into `learner_memory` for future follow-up but still allows the user to advance.

---

## PHASE 1: Linux, Git, and Industrial-Grade Python
* **AI Policy:** 100% Strict No-AI during Drills.
* **Execution Environment:** In-browser WebAssembly Linux (`v86` + `xterm.js`) for Milestone 1.1; Isolated Docker + GitHub App Repo Puller for Milestones 1.2–1.4.
* **Phase Mental Model:** A program is nothing magical—it is a Linux process with a Process ID (`PID`) that reads bytes from standard input (`fd 0`), manipulates memory, writes bytes to standard output (`fd 1`) or standard error (`fd 2`), and terminates with an integer exit code (`0` to `255`).

---

### Milestone 1.1: The Ubuntu Server Survival Toolkit
* **Real-World Disaster Story (Why You Learn This):** In January 2017, a tired GitLab engineer trying to clean up a lagged database server accidentally ran `rm -rf` on the live production directory, wiping out 300GB of user data across 5,000 projects because shell safety flags and path checks were missing. One careless terminal command can destroy a company.
* **Core Concepts:** `pwd`, `ls -la`, `cd`, `mkdir -p`, `cp -r`, `mv`, `rm`, `cat`, `less`, `head`, `tail -f`, `grep`, `find`, pipes (`|`), redirection (`>`, `>>`, `2>&1`), filedescriptors (`stdin=0`, `stdout=1`, `stderr=2`), permissions (`chmod`), processes (`ps aux`, `top`, `kill`), environment variables (`env`, `export`, `.bashrc`), exit codes (`$?`), and stream parsing (`awk`, `sed`, `jq`).
* **Primary Sources (Free):**
  * MIT *The Missing Semester of Your CS Education* (Lectures 1–4).
  * *OverTheWire: Bandit* (Levels 0–15).
  * *How Linux Works* (3rd Ed, Brian Ward — Chapters 1–4) + built-in Linux `man` pages.
* **Project Brief (`log_analyzer.sh`):**
  Write a POSIX/Bash script starting with `set -euo pipefail` that accepts a server log path as argument `$1`, validates that the file exists and is readable (printing an error to `stderr` and exiting with code `1` if missing), extracts all `500` and `403` HTTP status lines, counts the top 5 offending IP addresses, and outputs clean summary stats to `stdout`.
* **Gate 1 (Deterministic Pre-Check):**
  * Assert `head -n 5 log_analyzer.sh` contains `set -euo pipefail`.
  * Run `./log_analyzer.sh /nonexistent.log > /dev/null 2> err.txt` $\rightarrow$ Assert `$? -eq 1` and `err.txt` is non-empty.
  * Check `chmod` permissions confirm executable bit (`-x`) is set.
* **Gate 2 (Parameterized Live Sandbox Mutations — 1 Chosen Randomly):**
  * *Variant A:* "Filter a 10,000-line JSON access log using `jq` and `grep` to find all failed requests from a specific subnet and redirect *only* errors to `/tmp/audit_err.log`."
  * *Variant B:* "A rogue background script named `memory_leaker.sh` is eating CPU in this container. Find its `PID`, inspect its open file descriptors, and terminate it gracefully using `SIGTERM` (not `SIGKILL`)."
  * *Variant C:* "Fix a broken deployment script whose permissions are locked (`0000`) and whose pipeline silently swallows errors inside a subshell."
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** What is the exact difference between `stdout` (`fd 1`) and `stderr` (`fd 2`), and why does running `./script.sh > output.txt` still print errors to your terminal screen?
  * **Must-Know 2:** Break down every letter in `set -euo pipefail`. What bug happens in `false | echo "done"` if `pipefail` is omitted?
  * **Must-Know 3:** What does `chmod 750 deploy.sh` grant to the Owner, Group, and Others in binary/octal terms?
  * **May-Know (Stretch):** Why is `kill -9` (`SIGKILL`) dangerous to run on a database process compared to `kill -15` (`SIGTERM`), and where does the Linux kernel expose a running process's file descriptors on disk (`/proc/$PID/fd`)?

---

### Milestone 1.2: Git Internals & Collaborative Workflows
* **Real-World Disaster Story (Why You Learn This):** Junior engineers routinely panic during merge conflicts, run `git push --force` on shared branches, and overwrite days of their teammates' production commits—or delete a branch and rewrite code from scratch because they don't know Git is a content-addressable graph that keeps a local safety log (`reflog`).
* **Core Concepts:** SSH key authentication (`ssh-keygen`), Git's Directed Acyclic Graph (DAG: blobs, trees, commits, refs), `HEAD` vs. Staging Index vs. Working Tree, branching (`checkout -b` / `switch -c`), merging, resolving merge conflicts in the CLI, `git diff`, `git stash`, `git reset` (`--soft`, `--mixed`, `--hard`) vs. `git revert`, interactive rebase (`git rebase -i`), `git reflog`, and `git bisect`.
* **Primary Sources (Free):**
  * *Learn Git Branching* (`learngitbranching.js.org` — Main & Remote levels).
  * MIT *Missing Semester* (Lecture 6: Version Control).
  * *Pro Git* by Scott Chacon (Chapters 1–3, and Chapter 10 on Git Internals).
* **Project Brief:** Push `log_analyzer.sh` to GitHub over SSH, create two diverging feature branches that modify the exact same lines of code, merge them to trigger a real conflict, resolve the conflict cleanly without GUI tools, and squash messy WIP commits using `git rebase -i`.
* **Gate 1 (Deterministic Pre-Check):**
  * Clone student repo; inspect `git log --graph` to verify a real merge commit or clean rebased history exists with zero leftover `<<<<<<< HEAD` conflict markers.
* **Gate 2 (Parameterized Live Sandbox Mutations — The "Reflog Rescue" & Bisect Drill):**
  * *Variant A (The Deleted Work Trap):* Before the drill starts, the sandbox runs `git reset --hard HEAD~3` on the student's repo, wiping out their last 3 commits. Task: *"I just wiped your last 3 commits, bro. Recover them in under 4 minutes without rewriting your code."* (Requires `git reflog`).
  * *Variant B (The 64-Commit Bug Hunt):* The sandbox provides a repo with 64 historical commits where 1 unknown commit broke the test suite. Task: *"Use `git bisect` to isolate the exact offending commit hash in 6 steps or fewer."*
  * *Variant C (Interactive Rebase Cleanup):* Squash 5 messy commits (`"wip"`, `"typo"`, `"fix"`) into 2 clean atomic commits while dropping a commit that accidentally committed a `.env` secret file.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** Explain the exact difference between the Working Directory, the Staging Area (Index), and `HEAD`.
  * **Must-Know 2:** What is the difference between `git reset --hard` and `git revert`, and why will using `reset --hard` on a shared `main` branch make your team hate you?
  * **Must-Know 3:** How does Git actually store commits under the hood—are they stored as line-by-line diffs or full filesystem snapshots?
  * **May-Know (Stretch):** If you open the `.git/objects` directory, what are the 3 core object types Git hashes with SHA-1/SHA-256, and how does a `commit` object point to a `tree` and a `blob`?

---

### Milestone 1.3: Procedural Python, Debugging, Exceptions & File I/O
* **Real-World Disaster Story (Why You Learn This):** In Python, passing a mutable list or dictionary as a default argument (`def add_item(item, bucket=[]):`) creates a single shared object in memory at function definition time. Countless startups have leaked data across different customer accounts because a junior dev didn't understand Python's pass-by-object-reference and mutability rules.
* **Core Concepts:** Variables, control flow, functions, `try / except / else / finally`, context managers (`with open()`), `dict`, `set`, `list`, comprehensions, `json`, `csv`, `argparse` (replacing brittle `sys.argv` indexing), structured `logging` (replacing `print()`), mutability vs. immutability, and interactive step-through debugging (`breakpoint()` / `pdb`).
* **Primary Sources (Free):**
  * Harvard *CS50P* (Weeks 0–4, Week 6).
  * *Effective Python* (3rd Ed, Brett Slatkin — Items on Functions, Comprehensions, and Exceptions).
  * Official Python Documentation (`docs.python.org/3/library/pdb.html` & `argparse`).
* **Project Brief (`budget_cli.py`):** Build a command-line expense tracker using `argparse` subcommands (`add`, `list`, `summary`), persisting data to `expenses.json` safely via context managers, handling corrupted JSON or missing files without raw tracebacks, and writing operational errors to `app.log` via Python's `logging` module.
* **Gate 1 (Deterministic Pre-Check):**
  * AST scan verifies zero raw `except:` (bare excepts forbidden) and verifies `import argparse` and `import logging`.
  * Feed a corrupted `{bad_json` file into `budget_cli.py` $\rightarrow$ Assert clean error handling and non-zero exit code without an unhandled `JSONDecodeError` traceback.
* **Gate 2 (Parameterized Live Sandbox Mutations — The Broken-Repo `pdb` Bug Hunt):**
  * Student is dropped into a 250-line unfamiliar Python billing script that calculates wrong totals on edge cases. They must use `pdb` / `breakpoint()` in the terminal to inspect frame variables, find the hidden mutability/state bug, and fix it live.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** If you pass a Python `list` into a function and call `.append()` inside that function, why does the list outside the function change—even though reassigning `my_list = []` inside the function does NOT change the outside list?
  * **Must-Know 2:** Why is writing `except Exception:` (or bare `except:`) dangerous in production, and what happens to open file handles if an exception occurs when you don't use a `with` context manager?
  * **Must-Know 3:** Why does `def register_user(role, permissions=[]):` cause a catastrophic bug on the second function call?
  * **May-Know (Stretch):** How does Python's memory manager combine Reference Counting (`sys.getrefcount`) with a Cyclic Garbage Collector to clean up two objects that reference each other?

---

### Milestone 1.4: OOP, Type Hints, Automated Testing & Modern 2026 Packaging
* **Real-World Disaster Story (Why You Learn This):** Untyped, untested single-file Python scripts work fine at 200 lines and collapse at 5,000 lines when a function returns `None` instead of a `User` object—crashing in production at 3 AM with `AttributeError: 'NoneType' object has no attribute 'id'`. Static type checking (`mypy --strict`) and `pytest` catch this before code ever ships.
* **Core Concepts:** Classes, `__init__`, `@property`, `@dataclass`, **Composition over Inheritance**, static type annotations (`list[str]`, `dict[str, int]`, `T | None`, `typing.Protocol`), `venv`/`pip` fundamentals followed by the **2026 standard toolchain** (`uv` for environments/locking, `Ruff` for linting/formatting, `mypy --strict` for type checking), `src/` package layout, and `pytest` (fixtures, `@pytest.mark.parametrize`, mocking).
* **Primary Sources (Free):**
  * Harvard *CS50P* (Weeks 5, 7, 8, 9).
  * *ArjanCodes* (Dataclasses, Composition over Inheritance, `Protocol` vs. `ABC`).
  * *Python Testing with pytest* (2nd Ed, Brian Okken — Chapters 1–5).
* **Project Brief:** Refactor `budget_cli.py` into an installable `src/` Python package managed with `uv` (`pyproject.toml` + `uv.lock`), achieving 100% clean passes on `uv run ruff check`, `uv run mypy --strict`, and a `pytest` suite using fixtures and parameterized edge-case tests.
* **Gate 1 (Deterministic Pre-Check):**
  * Execute `uv run ruff check .`, `uv run mypy --strict .`, and `uv run pytest --cov=src --cov-fail-under=85`. All three must exit with code `0`.
* **Gate 2 (Parameterized Live Sandbox Mutations):**
  * Uncle Drill injects 3 subtle logic bugs into the implementation and asks the student to write parameterized `pytest` tests that expose all 3 bugs, then refactor a brittle 3-level class inheritance hierarchy into clean Composition using `@dataclass` and `Protocol`.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** When should you use a `@dataclass` instead of a standard Python class, and what methods does `@dataclass` generate automatically?
  * **Must-Know 2:** Why do senior engineers prefer **Composition over Inheritance** when designing backend services? Give a concrete example where inheritance breaks down.
  * **Must-Know 3:** What problem does committing `uv.lock` solve that a loose `requirements.txt` without pinned transitive hashes leaves exposed?
  * **May-Know (Stretch):** Explain the difference between Nominal Subtyping (inheriting from `abc.ABC`) and Structural Subtyping (`typing.Protocol`), and why `Protocol` makes unit testing and dependency injection cleaner.

---

## PHASE 2: Computer Science Fundamentals, Memory & Relational Databases
* **AI Policy:** 100% Strict No-AI during Drills.
* **Execution Environment:** Isolated Docker Sandbox (GCC/Clang for C, Python 3.12+, PostgreSQL 16 service container).
* **Phase Mental Model:** Abstractions are never free. Every line of high-level Python translates into CPU cycles, Stack/Heap RAM allocations, disk page reads, or B-Tree pointer traversals. An elite engineer knows the physical hardware cost of their code.

---

### Milestone 2.0: Under the Hood — Memory, Pointers & C Basics
* **Real-World Disaster Story (Why You Learn This):** In 2014, the infamous **Heartbleed** vulnerability compromised hundreds of thousands of web servers worldwide because a missing bounds check in C (`memcpy`) allowed attackers to read 64KB of raw Heap memory directly off servers—exposing private keys and user passwords.
* **Core Concepts:** Binary, Hexadecimal, ASCII vs. UTF-8 byte encoding, Stack memory vs. Heap memory, Pointers (memory addresses, `*` dereferencing, `&` address-of), contiguous arrays vs. dynamic memory allocation (`malloc` and `free`), buffer overflows, segmentation faults, and memory leaks (`valgrind`).
* **Primary Sources (Free):**
  * Harvard *CS50x* (Weeks 1–5: C, Arrays, Memory, Data Structures).
* **Gate 1 & Gate 2 (Sandbox C Memory Drill):**
  * Student is given a C program that suffers from a Segmentation Fault and a Heap memory leak. They must compile it with `gcc -Wall -Wextra -g`, inspect it with `gdb` / `valgrind`, fix the pointer arithmetic and missing `free()`, and achieve `0 errors, 0 bytes leaked`.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** Why can a CPU jump to the 50,000th element of a contiguous C array in $O(1)$ constant time using pointer arithmetic, whereas finding the 50,000th item of a Linked List requires 50,000 separate memory hops?
  * **Must-Know 2:** What is the exact difference between the **Stack** and the **Heap**, and why does a local array inside a function vanish when the function returns while `malloc` memory stays alive?
  * **May-Know (Stretch):** Why is iterating over a contiguous Array in RAM 10x to 50x faster on modern CPUs than traversing a Linked List even though both are theoretically $O(n)$? (Tests CPU L1/L2 cache lines and spatial locality).

---

### Milestone 2.1: Data Structures, Algorithms & Big-O Notation
* **Real-World Disaster Story (Why You Learn This):** In 2019, a major gaming company froze player login screens worldwide for 20 minutes every time a user logged in because a developer used an $O(n^2)$ nested array search inside a JSON parser parsing 30,000 item IDs—performing 900 million comparisons per login instead of 30,000 $O(1)$ hash lookups.
* **Core Concepts:** Time & Space Complexity ($O(1)$, $O(\log n)$, $O(n)$, $O(n \log n)$, $O(n^2)$), Dynamic Arrays, Linked Lists, Stacks, Queues (`collections.deque`), Hash Tables (hash functions, load factor, collisions), Binary Search, Recursion, and Trees/Graphs (BFS/DFS).
* **Primary Sources (Free):**
  * *Grokking Algorithms* (Chapters 1–9) & *A Common-Sense Guide to Data Structures and Algorithms* (Jay Wengrow).
  * *NeetCode.io* (Core 40 Roadmap across Arrays/Hashing, Two Pointers, Stack, Binary Search, Trees).
* **Project Brief (`custom_hashmap.py`):** Implement a Hash Table from scratch in Python without using `dict`—using a fixed-size backing list, a custom polynomial rolling hash function, collision handling via Separate Chaining, automatic dynamic resizing (`2x` capacity) when the load factor exceeds `0.7`, and full `pytest` verification.
* **Gate 1 & Gate 2 (Sandbox Complexity & Collision Drill):**
  * Deterministic benchmark script inserts 50,000 keys into the student's `CustomHashMap` and asserts average lookup remains $O(1)$ (under strict millisecond threshold), then forces a collision storm to verify zero data loss.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** Why is `my_list.pop(0)` in Python an $O(n)$ operation while `collections.deque.popleft()` is $O(1)$? Explain what happens in memory when index `0` is removed from a dynamic array.
  * **Must-Know 2:** What happens to a Hash Map's time complexity if a bad hash function produces the exact same bucket index for every single key, and how does dynamic resizing when load factor hits `0.7` prevent this?
  * **May-Know (Stretch):** How does Python's built-in `dict` handle collisions differently from Separate Chaining (Open Addressing with pseudo-random probing) and why does that save memory?

---

### Milestone 2.2: Relational Databases, Raw SQL & Storage Internals (PostgreSQL)
* **Real-World Disaster Story (Why You Learn This):** Early fintech and crypto platforms lost millions of dollars to **TOCTOU (Time-of-Check to Time-of-Use) Race Condition Attacks**: a user with a ₦10,000 balance sends 5 simultaneous "Withdraw ₦10,000" requests in the same millisecond. Because the developer wrote `SELECT balance` in Python before running `UPDATE balance`, all 5 requests read ₦10,000 and paid out ₦50,000.
* **Core Concepts:** PostgreSQL CLI (`psql`), Schema design (`1NF–3NF`), Primary/Foreign keys, `JOIN` types, Aggregations, B-Tree Indexes, reading query plans (`EXPLAIN ANALYZE` — Sequential Scan vs. Index Scan vs. Bitmap Heap Scan), ACID Transactions, SQL Injection prevention (parameterized queries), and Concurrency locking (`SELECT ... FOR UPDATE` / Isolation Levels).
* **Primary Sources (Free):**
  * *PostgreSQL Exercises* (`pgexercises.com`) & *Use The Index, Luke* (`use-the-index-luke.com` / Markus Winand).
  * Hussein Nasser’s *PostgreSQL Internals, Indexing & ACID* lectures.
* **Project Brief (`wallet_ledger.py` + PostgreSQL):** Build a double-entry financial ledger using `psycopg` (v3) and raw SQL. Seed 500,000 transaction rows, optimize a slow reporting query using a composite B-Tree index verified via `EXPLAIN ANALYZE`, and build an atomic `transfer_funds()` function that survives 20 concurrent withdrawal threads attempting to double-spend.
* **Gate 1 & Gate 2 (Deterministic Concurrency & Index Benchmark):**
  * Gate 1 spawns 20 parallel worker threads firing simultaneous withdrawals against a ₦10,000 test balance in the student's database $\rightarrow$ Asserts final balance is never negative (`>= 0`) and total transferred equals exactly ₦10,000.
  * Gate 2 runs `EXPLAIN (ANALYZE, FORMAT JSON)` on the student's indexed query across 500,000 rows $\rightarrow$ Asserts `"Node Type": "Index Scan"` (or `"Index Only Scan"`) and execution time under `5ms`.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** Walk through the exact millisecond-by-millisecond timeline of a Double-Spend Race Condition when two requests run `SELECT balance FROM wallets WHERE id = 1` simultaneously, and explain how `SELECT ... FOR UPDATE` inside a transaction blocks the second request.
  * **Must-Know 2:** Why doesn't a database just put an index on every single column automatically? What is the hidden write cost (`INSERT`/`UPDATE`/`DELETE`) of adding 10 B-Tree indexes to a table?
  * **Must-Know 3:** In a composite index on `(user_id, created_at)`, why will a query filtering *only* by `WHERE created_at > '2026-01-01'` fail to use the index cleanly?
  * **May-Know (Stretch):** How does PostgreSQL's **MVCC (Multi-Version Concurrency Control)** allow readers to never block writers by storing dead row versions (`tuples`), and why does PostgreSQL need `VACUUM` to clean them up?

---

## PHASE 3: Networking, Concurrency, Web Servers & Modern APIs
* **AI Policy:** **Intermediate Controlled-AI Mode Unlocked.** Students learn to build production systems and audit AI-generated Pull Requests for subtle concurrency, security, and database bugs.
* **Drill Format Upgrade:** Adds a **Live Socratic Architecture Interview** + **"Spot the AI Slop" PR Verification Drill**.
* **Phase Mental Model:** The network is slow, hostile, and unreliable. Never trust client payloads, never block the single-threaded event loop, and design every mutation endpoint assuming the client will retry the exact same request 3 times on a flaky 3G connection.

---

### Milestone 3.1: Networking, HTTP/TLS & Python Concurrency (`asyncio`)
* **Real-World Disaster Story (Why You Learn This):** A single synchronous call like `time.sleep(5)` or `requests.get()` placed inside an `async def` FastAPI endpoint freezes the entire Python single-threaded event loop—meaning 1 slow external API call blocks 500 other users from even loading the healthcheck endpoint.
* **Core Concepts:** IP addresses, Ports, DNS resolution, TCP 3-Way Handshake (`SYN`, `SYN-ACK`, `ACK`), TLS/HTTPS encryption handshake, HTTP methods/headers/status codes, `curl -v`, CPU-bound (`multiprocessing`) vs. I/O-bound (`threading` vs. `asyncio`), Event Loop mechanics, `httpx.AsyncClient`, `asyncio.gather`, timeouts, and exponential backoff retries.
* **Primary Sources (Free):**
  * *High Performance Browser Networking* by Ilya Grigorik (`hpbn.co` — Chapters 1–4).
  * RealPython *Async IO in Python: A Complete Walkthrough*.
* **Project Brief (`async_aggregator.py`):** Build a concurrent data aggregator using `httpx.AsyncClient` and `asyncio` that fetches weather/financial metrics for 25 endpoints concurrently in under `1.5s`, implements jittered exponential backoff on `429 Too Many Requests` / `503` errors, enforces strict request timeouts, and caches valid responses locally with a TTL.
* **Gate 1 & Gate 2 (Event Loop Blocking & Retry Audit):**
  * Sandbox spins up a chaos mock server that randomly injects `503` errors and `2s` latency. Student's script must complete 25 fetches in under `2.5s` without dropping data.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** Trace every network step from typing `https://api.paystack.co` into a client to receiving the first HTTP response byte (DNS $\rightarrow$ TCP Handshake $\rightarrow$ TLS Handshake $\rightarrow$ HTTP Request).
  * **Must-Know 2:** Why does calling standard `requests.get()` or `time.sleep()` inside an `async def` function freeze every other concurrent request on the server, whereas `await httpx_client.get()` does not?
  * **May-Know (Stretch):** Why do we add random **Jitter** to Exponential Backoff when 10,000 mobile clients lose connection and reconnect to a struggling server at the same time (The Thundering Herd problem)?

---

### Milestone 3.2: Production REST APIs, Auth, ORMs & Architecture (FastAPI + SQLAlchemy 2.0)
* **Real-World Disaster Story (Why You Learn This):** A Nigerian e-commerce startup integrated payment webhooks without verifying the cryptographic `HMAC-SHA512` header or enforcing an idempotency key. Attackers sent fake `"charge.success"` JSON payloads via Postman to ship free electronics, while legitimate users on slow 3G connections double-clicked "Pay" and got billed twice.
* **Core Concepts:** FastAPI, Pydantic v2 validation, **SQLAlchemy 2.0 modern `select()` syntax** (banning legacy `session.query()`), Alembic migrations, Clean Layered Architecture (Routes $\rightarrow$ Services $\rightarrow$ Repositories), Dependency Injection (`Depends`), Argon2 password hashing, JWT authentication, Role-Based Access Control (RBAC), Cursor/Keyset Pagination vs. `OFFSET`, **Idempotency Keys**, and **Webhook `HMAC` Signature Verification**.
* **Primary Sources (Free):**
  * *FastAPI Best Practices* (`github.com/zhanymkanov/fastapi-best-practices`).
  * *Architecture Patterns with Python* (`cosmicpython.com` — Chapters 1–4).
  * SQLAlchemy 2.0 Unified Tutorial (Official Docs).
* **Project Brief:** Build a Multi-Tenant Project & Billing API with FastAPI, PostgreSQL, SQLAlchemy 2.0, and Alembic. Include Cursor-based pagination, Argon2 auth, an idempotent payment webhook receiver verifying `HMAC-SHA256` signatures, and an isolated `pytest` + `TestClient` suite.
* **Gate 1 & Gate 2 ("Spot the AI Slop" PR Verification Drill):**
  * Uncle Drill hands the student a 180-line FastAPI Pull Request generated by an AI coding assistant. The PR passes happy-path tests but hides **3 fatal production flaws**: (1) an $N+1$ lazy-loading SQLAlchemy query inside a loop, (2) string comparison `==` instead of `hmac.compare_digest()` on a webhook signature, and (3) `OFFSET` pagination that degrades on 1M rows. The student must find all 3, write failing tests, and fix them in the sandbox.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** Why does `SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 500000` become painfully slow in PostgreSQL, and how does Cursor/Keyset pagination (`WHERE id > last_seen_id LIMIT 20`) keep it under `1ms`?
  * **Must-Know 2:** How do **Idempotency Keys** prevent a user on a flaky 3G network from being charged twice when their phone retries a `POST /checkout` request?
  * **Must-Know 3:** Why must you verify the `x-paystack-signature` (`HMAC`) using the raw request body bytes before trusting any data inside a webhook endpoint?
  * **May-Know (Stretch):** What is the **SQLAlchemy $N+1$ Query Problem**, and what is the difference between fixing it with `joinedload()` versus `selectinload()`?

---

## PHASE 4: Production Systems, Docker, Observability & Cloud Deployment
* **Phase Mental Model:** *"It works on my laptop"* is an excuse, not engineering. Code only matters when it builds reproducibly in CI, runs as an unprivileged container, degrades gracefully when a cache crashes, and alerts you before customers notice an outage.

---

### Milestone 4.1: Linux Containers (Docker) & Automated CI/CD Quality Gates
* **Core Concepts:** Images vs. Containers, Linux namespaces & cgroups basics, Multi-stage `Dockerfile` builds, Docker layer caching optimization, running containers as a non-root user (`USER appuser`), `.dockerignore`, `docker-compose.yml` with healthchecks (`service_healthy`), and GitHub Actions CI pipelines blocking merges on `ruff`, `mypy --strict`, and `pytest` failures.
* **Gate 1 & Gate 2 (Container Hardening Drill):**
  * Student is given a bloated `1.2GB` Dockerfile running as `root` that rebuilds all Python dependencies on every single code edit. They must refactor it into a multi-stage build under `220MB`, running as a non-root UID, with cached dependency layers.
* **Gate 3 (Uncle Drill Defense Rubric):**
  * **Must-Know 1:** Why must you copy `pyproject.toml` and `uv.lock` and install dependencies *before* running `COPY . .` in a `Dockerfile`?
  * **Must-Know 2:** What is the security risk of leaving a Docker container running as the default `root` user in production?
  * **May-Know (Stretch):** How does a container differ from a Virtual Machine at the OS kernel level (sharing the host Linux kernel via `namespaces` and `cgroups` vs. hypervisor guest OS)?

---

### Milestone 4.2: Caching, Queues, Reverse Proxies & Live Cloud Capstone
* **Real-World Disaster Story (Why You Learn This):** When a popular cached database item expires at the exact moment 10,000 users request the homepage, all 10,000 requests miss Redis simultaneously and slam PostgreSQL at the exact same millisecond—crashing the entire database (**The Cache Stampede / Dogpile Effect**).
* **Core Concepts:** Redis Cache-Aside pattern, TTLs & cache invalidation, Token-Bucket Rate Limiting in Redis, background workers (`Celery` / `RQ` / `ARQ`), Nginx Reverse Proxy & TLS termination, structured JSON logging, `/health` readiness probes, and **Graceful Degradation**.
* **Primary Sources:** *Designing Data-Intensive Applications* (Martin Kleppmann — Chapters 1–5) & *System Design Interview* (Alex Xu).
* **Capstone Project (`High-Concurrency URL Shortener & Analytics Engine`):**
  * Sub-5ms redirect caching via Redis (`Cache-Aside`), IP rate limiting, async click analytics written via background worker queues so redirects never block on PostgreSQL writes, containerized behind Nginx.
* **Gate 2 (Live Chaos Engineering Drill):**
  * While the automated load tester fires 200 requests/sec at the student's Capstone API inside the sandbox, **Uncle Drill secretly kills the Redis container (`docker stop redis`)**.
  * **Pass Condition:** The API must catch the `RedisConnectionError`, log a warning, fall back cleanly to PostgreSQL without returning `500 Internal Server Error` to users, and recover automatically when Redis restarts.
* **Gate 3 (Principal Engineer Final Defense):**
  * **Must-Know 1:** When your user updates their destination URL in PostgreSQL, should your code update Redis at the same time or delete (`DEL`) the Redis key? Explain the race condition that happens if two concurrent updates write to DB and Cache out of order.
  * **Must-Know 2:** What is a **Cache Stampede**, and how do you prevent 5,000 requests from hitting PostgreSQL simultaneously when a hot Redis key expires? (Tests mutex locks / probabilistic early expiration).

---

## PHASE 5: The Polyglot Systems Mastery Track (Go or Rust)
* **Why This Phase Exists:** Beginners think they are "Python Developers." Senior engineers are **Software Engineers** who treat languages as tools. Once you master Phases 1–4, learning a compiled systems language takes weeks, not years. Students choose **Track 5A (Go)** or **Track 5B (Rust)** and rebuild a core infrastructure service from Phase 3/4.

| Track | Project to Build | Core Concepts Audited by Uncle Drill |
| :--- | :--- | :--- |
| **Track 5A: Go (Cloud & High-Concurrency Backend)** | **Concurrent Rate-Limited Reverse Proxy & Worker Pool** | Static compilation, Structs & implicit Interfaces, Pointers vs. Values, Goroutines (`go`), Buffered vs. Unbuffered Channels, `select`, `context.Context` cancellation, and `sync.Mutex` race detector (`go test -race`). |
| **Track 5B: Rust (Memory-Safe High-Performance Systems)** | **Zero-Allocation Log Parser & Custom Redis-Protocol (`RESP`) Server** | Ownership rules, Borrowing (`&T` vs. `&mut T`), Lifetimes (`'a`), Stack vs. Heap without a Garbage Collector, `Result<T, E>` & `Option<T>` exhaustive pattern matching, Traits, and fearless concurrency with `Tokio`. |

---

## 2. Database Contract: How a Rubric Lives in `audit_rubrics_private`

To ensure the Google Antigravity Database & AI Agents never guess how rubrics are structured, every milestone row in `audit_rubrics_private` conforms to this exact JSONB schema:

```json
{
  "milestone_id": "1.1-ubuntu-survival",
  "phase": 1,
  "ai_policy": "STRICT_NO_AI",
  "sandbox_type": "WASM_V86_LINUX",
  "time_limit_minutes": 25,
  "gate_1_deterministic_checks": [
    {
      "id": "check_pipefail",
      "command": "grep -E 'set -euo pipefail|set -o pipefail' log_analyzer.sh",
      "expected_exit_code": 0,
      "fail_roast_hint": "Student forgot industrial Bash safety flags (set -euo pipefail)."
    },
    {
      "id": "check_missing_file_stderr",
      "command": "./log_analyzer.sh /missing_file.log > /tmp/out 2> /tmp/err",
      "expected_exit_code": 1,
      "assert_stderr_non_empty": true,
      "fail_roast_hint": "Script exited 0 on a missing file or printed error to stdout instead of stderr."
    }
  ],
  "gate_2_mutations": [
    {
      "variant_id": "VARIANT_A_SUBNET_FILTER",
      "setup_script": "seed_corrupt_logs.sh",
      "task_prompt": "Filter /var/log/nginx/access.log for HTTP 500 errors from 192.168.1.*, count unique IPs, and redirect any parse errors to /tmp/errors.log.",
      "verify_command": "cmp -s /tmp/student_ips.txt /root/.expected_ips.txt"
    }
  ],
  "gate_3_socratic_rubric": {
    "must_knows": [
      {
        "id": "mk_1_streams",
        "question_intent": "Difference between stdout (fd 1) and stderr (fd 2) when redirecting with >",
        "required_concepts": ["file descriptor 1", "file descriptor 2", "default > only redirects stdout", "stderr still goes to terminal unless 2>&1 is used"]
      },
      {
        "id": "mk_2_pipefail",
        "question_intent": "Why false | echo 'ok' succeeds in standard bash without set -o pipefail",
        "required_concepts": ["pipeline exit status defaults to last command", "pipefail returns non-zero if any command in pipe fails"]
      }
    ],
    "may_knows": [
      {
        "id": "may_1_sigkill",
        "question_intent": "Why kill -9 (SIGKILL) corrupts state compared to kill -15 (SIGTERM)",
        "stretch_concepts": ["SIGTERM allows cleanup handler / flushing buffers", "SIGKILL is intercepted by kernel immediately with zero cleanup"]
      }
    ]
  }
}

## 3. Interactive Explorer: Step Through the 5-Phase Grading & Mutation Pipeline

Use the interactive state machine below to test how a student moves through **Gate 1 (Deterministic Pre-Check)**, **Gate 2 (Randomized Sandbox Mutation)**, and **Gate 3 (`Must-Know` vs. `May-Know` Socratic Defense)** across all 5 Phases:

<GenerateWidget component_placeholder_id="im_f757df21d288045c" height="600px" type="inline_visualization">
<skills>diagram</skills>

**Idea:** An interactive 3-Gate Deterministic & AI Grading Pipeline Explorer for `03_CURRICULUM_RUBRICS.md`, allowing the user to select any Milestone across Phases 1 to 5 and step through Gate 1 (Deterministic Pre-Check), Gate 2 (Parameterized Anti-Cheat Mutation), and Gate 3 (Must-Know vs. May-Know Socratic Defense).
**Visual type:** Interactive state-machine flowchart and rubric inspector with milestone selector and gate step controls.
**Data specification:**
- **Data structure:** State machine with 4 sequential evaluation nodes (`Student Submission & Telemetry`, `Gate 1: Deterministic Pre-Grader (0 Tokens)`, `Gate 2: Parameterized Live Sandbox Mutation`, `Gate 3: Uncle Drill Socratic Defense`) mapped across 6 representative Milestones (`1.1 Linux Survival`, `1.2 Git Internals`, `1.4 Modern Python (uv/ruff/mypy)`, `2.2 Postgres Race Conditions`, `3.2 FastAPI + AI Slop PR Audit`, `4.2 Redis Chaos Capstone`).
- **Initial values:**
  - `Milestone 1.1 (Linux)`: Gate 1 checks `set -euo pipefail` and exit code `1` on `stderr`; Gate 2 mutates `/var/log/nginx/access.log` or spawns rogue process; Gate 3 tests `fd 1` vs `fd 2` (Must-Know) and `SIGTERM` vs `SIGKILL` (May-Know).
  - `Milestone 1.2 (Git)`: Gate 1 verifies clean DAG history without conflict markers; Gate 2 executes `git reset --hard HEAD~3` forcing live `git reflog` recovery or 64-commit `git bisect`; Gate 3 tests `reset` vs `revert` (Must-Know) and `.git/objects` blobs/trees (May-Know).
  - `Milestone 1.4 (Python 2026 Stack)`: Gate 1 executes `uv run ruff check`, `uv run mypy --strict`, and `uv run pytest --cov-fail-under=85`; Gate 2 injects 3 subtle bugs requiring parameterized `@pytest.mark.parametrize` tests; Gate 3 tests Composition over Inheritance (Must-Know) and `typing.Protocol` (May-Know).
  - `Milestone 2.2 (Postgres Internals)`: Gate 1 fires 20 parallel withdrawal threads to test double-spend protection; Gate 2 checks `EXPLAIN (ANALYZE, FORMAT JSON)` for `Index Scan` under 5ms on 500k rows; Gate 3 tests `SELECT ... FOR UPDATE` TOCTOU defense (Must-Know) and MVCC/VACUUM (May-Know).
  - `Milestone 3.2 (FastAPI + AI PR Audit)`: Gate 1 runs integration test suite; Gate 2 presents a 180-line AI-generated PR hiding an N+1 query, missing `hmac.compare_digest`, and slow `OFFSET` pagination; Gate 3 tests Cursor Pagination & Idempotency Keys (Must-Know).
  - `Milestone 4.2 (Redis Chaos Capstone)`: Gate 1 verifies Docker non-root user and healthchecks; Gate 2 kills the Redis container (`docker stop redis`) under 200 req/s load to verify graceful PostgreSQL fallback; Gate 3 tests Cache Stampede mutex defense (Must-Know).
- **Mapping:** Top selector switches active Milestone; main canvas displays the 3-Gate state transitions (Pass path in green, Fail/Roast loop in red/amber, May-Know stretch bonus in cyan); bottom inspector shows the exact JSON rubric and terminal commands executed.
**User controls:** Milestone Selector (`1.1`, `1.2`, `1.4`, `2.2`, `3.2`, `4.2`), Gate Step buttons (`Prev Gate` / `Next Gate`), and Outcome Simulator toggle (`Simulate Student Pass`, `Simulate Gate 1 Failure`, `Simulate Must-Know Failure`).
**Interactivity:** Clicking any Gate node or Milestone displays the exact deterministic shell assertion, randomized mutation script, and Uncle Drill grading rubric from `03_CURRICULUM_RUBRICS.md`.
**Animation:** Animated state transitions showing where a failing submission gets blocked at Gate 1 (saving AI tokens) versus advancing through Gate 2 and Gate 3.
</GenerateWidget>