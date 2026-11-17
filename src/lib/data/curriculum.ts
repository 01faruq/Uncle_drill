/**
 * @purpose Canonical Curriculum Database & Milestone Resolver.
 *   Provides production-grade curriculum data for Phase 1–5 and powers /roadmap & /milestone/[milestoneId].
 *   Acts as an offline-resilient fallback and Supabase seed foundation.
 * @security Zero rubric answers or hidden test assertions are stored here. Pure educational specs.
 * @reference docs/03_CURRICULUM_RUBRICS.md, docs/07_UX_WRITING_AND_VOICE.md
 */

import {
  CurriculumPhase,
  Milestone,
  MilestoneProgress,
} from "@/modules/curriculum/types";

export const CANONICAL_PHASE_1_MILESTONES: Milestone[] = [
  {
    milestoneId: "1.1",
    slug: "1.1-ubuntu-survival",
    phase: 1,
    sequenceOrder: 1,
    title: "The Ubuntu Server Survival Toolkit & Streams",
    shortTitle: "Ubuntu Server Survival",
    summary:
      "Master POSIX filedescriptors, standard streams, exit codes, process lifecycle, and log parsing under pressure.",
    isLiveInV1: true,
    status: "READY",
    timeLimitMinutes: 25,
    disasterStory: {
      title: "The 300GB Database Wipeout",
      company: "GitLab",
      year: "2017",
      narrative:
        "In January 2017, an exhausted system engineer attempting to clean up a lagging PostgreSQL replication secondary accidentally ran rm -rf on the live directory, wiping out 300GB of production data across 5,000 repositories. The backup pipeline silently failed because shell scripts didn't validate paths or check exit codes. One careless terminal command caused a multi-day global outage.",
      lesson:
        "A script that runs without 'set -euo pipefail', unvalidated paths, or understanding stdout vs stderr redirection will eventually destroy production. Never run commands you cannot explain line by line.",
    },
    mentalModel: {
      title: "Processes, File Descriptors & UNIX Streams",
      coreThesis:
        "A program is nothing magical. It is a Linux process with a PID that reads bytes from stdin (fd 0), manipulates memory, writes bytes to stdout (fd 1) or stderr (fd 2), and terminates with an integer exit code (0–255).",
      paragraphs: [
        "Everything in UNIX is exposed as a stream of bytes. When you type in a terminal, the kernel binds standard input (fd 0) to your keyboard. When your script produces output, standard output (fd 1) streams to your terminal screen. Errors use standard error (fd 2)—an independent channel so diagnostics never corrupt data pipelines.",
        "When you run 'script > out.txt', only fd 1 is captured. If you don't redirect fd 2 with '2>&1', errors bypass the file and spill onto your console screen. If you pipe commands ('cmd1 | cmd2'), the kernel connects cmd1's fd 1 to cmd2's fd 0. Without 'pipefail', bash only reports the exit code of cmd2, completely hiding if cmd1 crashed.",
      ],
      keyTakeaways: [
        "File Descriptors: 0 = stdin, 1 = stdout, 2 = stderr.",
        "Redirection: '2>&1' merges stderr into stdout; '>>' appends without truncating.",
        "Safety Armor: Always prefix scripts with 'set -euo pipefail'.",
        "Exit Codes: 0 = success, non-zero = failure ($? captures last status).",
      ],
    },
    practiceProject: {
      title: "Production Access Log Sentinel",
      artifactName: "log_analyzer.sh",
      brief:
        "Write an executable POSIX/Bash script that parses a 50,000-line server access log, filters HTTP 5xx and 403 outages, aggregates the top 5 offending client IP addresses, and outputs clean telemetry statistics to stdout while directing error logs strictly to stderr.",
      requirements: [
        "Script starts with '#!/usr/bin/env bash' and 'set -euo pipefail'.",
        "Validates that argument $1 exists and is readable; exits with code 1 and writes to stderr on failure.",
        "Parses HTTP status codes using awk/sed/grep and prints the top 5 IP addresses cleanly.",
        "Must be marked executable (chmod +x) and handle empty log files without unhandled crashes.",
      ],
      exploreBeyondWarning:
        "Uncle Drill Warning: Uncle Drill tests edge cases beyond this guide. The checklist and practice project cover the foundation, but Uncle Drill will inject unannounced mutations and interrogate edge cases during the live drill. Do not enter assuming simple questions.",
    },
    resources: [
      {
        id: "res-1-1-1",
        milestoneId: "1.1",
        title: "The Missing Semester: The Shell & Shell Tools",
        url: "https://missing.csail.mit.edu/2020/shell-tools/",
        formatType: "VIDEO_LECTURE",
        learningStyleTags: ["VISUAL", "HANDS_ON"],
        uncleCommentary:
          "Watch lectures 1 and 2. Stop looking for GUI shortcuts; learn how pipes actually transport byte streams between processes.",
      },
      {
        id: "res-1-1-2",
        milestoneId: "1.1",
        title: "How Linux Works (Brian Ward) — Chapters 1 to 4",
        url: "https://nostarch.com/howlinuxworks3",
        formatType: "BOOK_CHAPTER",
        learningStyleTags: ["THEORETICAL", "DEEP_DIVE"],
        uncleCommentary:
          "Read chapters on processes, file descriptors, and kernel signals. If you don't know what SIGTERM does, you are not ready for production.",
      },
      {
        id: "res-1-1-3",
        milestoneId: "1.1",
        title: "Linux manual pages: man 1 bash & man 2 kill",
        url: "https://man7.org/linux/man-pages/man1/bash.1.html",
        formatType: "OFFICIAL_DOC",
        learningStyleTags: ["REFERENCE", "PRIMARY_SOURCE"],
        uncleCommentary:
          "Primary source documentation. Uncle Drill checks if you know how to navigate man pages without touching Google.",
      },
    ],
    checklist: [
      {
        id: "chk-1-1-1",
        label: "Can explain the exact difference between stdin (0), stdout (1), and stderr (2)",
        category: "BASIC",
        description: "Know why '2>&1' is needed and what file descriptors represent.",
      },
      {
        id: "chk-1-1-2",
        label: "Understand every flag in 'set -euo pipefail' and what failure occurs if omitted",
        category: "REQUIRED",
        description: "Know how bash pipeline exit codes behave without pipefail in 'false | echo done'.",
      },
      {
        id: "chk-1-1-3",
        label: "Know how to inspect process table with 'ps aux', open files with 'lsof', and signal with 'kill'",
        category: "REQUIRED",
        description: "Distinguish graceful shutdown (SIGTERM 15) from ungraceful kill (SIGKILL 9).",
      },
      {
        id: "chk-1-1-4",
        label: "Can parse text streams using awk, sed, cut, sort, and uniq -c in a single pipeline",
        category: "REQUIRED",
        description: "Able to extract fields and calculate frequencies without writing Python scripts.",
      },
      {
        id: "chk-1-1-5",
        label: "Can translate octal permissions (e.g. 750, 644) into binary and rwx representation",
        category: "REQUIRED",
        description: "Know what owner, group, and other bits permit.",
      },
      {
        id: "chk-1-1-6",
        label: "Explore Beyond: Inspect kernel process state via /proc/$PID/fd and /proc/$PID/status",
        category: "EXPLORE_BEYOND",
        description: "Understand how the virtual /proc filesystem exposes running process memory and file handles.",
      },
    ],
    nonNegotiables: [
      "File descriptor fundamentals (0, 1, 2) and redirection syntax.",
      "Pipeline safety with 'set -euo pipefail'.",
      "Process lifecycle and signal handling (SIGTERM vs SIGKILL).",
      "Stream aggregation via awk/sed and exit code verification.",
    ],
    stressTestQuestions: [
      "Where does the Linux kernel expose open file descriptors on disk for a running process?",
      "Why is kill -9 dangerous to send to a database engine holding uncommitted WAL pages in memory?",
    ],
  },
  {
    milestoneId: "1.2",
    slug: "1.2-git-internals",
    phase: 1,
    sequenceOrder: 2,
    title: "Git Internals, DAG Recovery & Reflog",
    shortTitle: "Git Internals & DAG Recovery",
    summary:
      "Demystify Git's Directed Acyclic Graph. Recover lost commits via reflog, perform interactive rebases, and resolve complex CLI merge conflicts.",
    isLiveInV1: true,
    status: "READY",
    timeLimitMinutes: 25,
    disasterStory: {
      title: "The Force-Push That Obliterated Team Velocity",
      company: "Stealth FinTech",
      year: "2021",
      narrative:
        "A junior engineer encountering a merge conflict on the shared staging branch panicked and ran 'git push --force'. It wiped out 48 commits written by four engineers over three days. The team spent 14 hours re-assembling commits because nobody on the floor knew how to inspect 'git reflog' or query dangling commit objects in the .git/objects store.",
      lesson:
        "Git is not a magical cloud backup. It is a content-addressable directed acyclic graph. Once you understand blobs, trees, and commit hashes, deleted work is almost always recoverable via reflog.",
    },
    mentalModel: {
      title: "Git as a Content-Addressable Graph",
      coreThesis:
        "Git is an immutable key-value store with a VCS interface on top. Every file is a blob, every directory is a tree, and every commit is a snapshot pointing to a root tree and parent commits.",
      paragraphs: [
        "Git does not store diffs between commits. It stores full snapshots. When you commit, Git compresses the file into a blob object identified by its SHA hash. If a file hasn't changed, the new tree object points to the existing blob hash without duplicating bytes.",
        "Branches are just lightweight 41-byte text files holding a SHA hash pointing to a commit. Moving branches or checking out commits simply changes where HEAD points. If you run 'git reset --hard HEAD~3', the commits still exist in the object store. They are merely unreachable from the branch pointer, and reflog records every move HEAD ever made.",
      ],
      keyTakeaways: [
        "Objects: Blobs (content), Trees (directories), Commits (metadata + root tree + parents).",
        "HEAD is just a pointer to the current branch or commit.",
        "Reflog tracks local HEAD movements for 30–90 days, enabling recovery of wiped commits.",
        "Rebase rewrites commit history; merge preserves true chronological topology.",
      ],
    },
    practiceProject: {
      title: "DAG Conflict Simulator & Reflog Recovery",
      artifactName: "git_disaster_recovery",
      brief:
        "Simulate two diverging feature branches with conflicting modifications to identical lines. Resolve the conflict cleanly in the CLI without GUI helpers. Then perform an intentional 'git reset --hard HEAD~3' and restore all wiped commits within 4 minutes using 'git reflog'.",
      requirements: [
        "Repo initialized with clean commit history over SSH.",
        "Two feature branches branched from main modifying the same file.",
        "Merge conflict resolved cleanly with zero leftover <<<<<<< HEAD markers.",
        "Interactive rebase squashes 4 WIP commits into 2 clean semantic commits.",
        "Simulated hard reset recovered cleanly using git reflog.",
      ],
      exploreBeyondWarning:
        "Uncle Drill Warning: Uncle Drill tests edge cases beyond this guide. The checklist and practice project cover the foundation, but Uncle Drill will inject unannounced mutations and interrogate edge cases during the live drill. Do not enter assuming simple questions.",
    },
    resources: [
      {
        id: "res-1-2-1",
        milestoneId: "1.2",
        title: "Pro Git (Scott Chacon) — Chapter 10: Git Internals",
        url: "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects",
        formatType: "OFFICIAL_DOC",
        learningStyleTags: ["DEEP_DIVE", "PRIMARY_SOURCE"],
        uncleCommentary:
          "Read Chapter 10 twice. Inspect .git/objects with cat-file. If you understand how a commit points to a tree, you will never panic in Git again.",
      },
      {
        id: "res-1-2-2",
        milestoneId: "1.2",
        title: "Learn Git Branching (Interactive Visualization)",
        url: "https://learngitbranching.js.org/",
        formatType: "INTERACTIVE_SIM",
        learningStyleTags: ["VISUAL", "HANDS_ON"],
        uncleCommentary:
          "Complete the advanced rebase and cherry-pick modules. Visualizing DAG pointer manipulation is non-negotiable.",
      },
    ],
    checklist: [
      {
        id: "chk-1-2-1",
        label: "Can explain the 3 areas: Working Tree, Staging Index, and HEAD",
        category: "BASIC",
        description: "Know what git add and git commit move between these three zones.",
      },
      {
        id: "chk-1-2-2",
        label: "Know the difference between git reset (--soft, --mixed, --hard) vs git revert",
        category: "REQUIRED",
        description: "Understand why reset rewrites local history and revert creates an inverse commit safe for shared remotes.",
      },
      {
        id: "chk-1-2-3",
        label: "Can recover accidentally deleted commits or branches using 'git reflog'",
        category: "REQUIRED",
        description: "Know how to query reflog and reset or cherry-pick unreachable commit SHAs.",
      },
      {
        id: "chk-1-2-4",
        label: "Can perform interactive rebase (git rebase -i) to squash, edit, and drop commits",
        category: "REQUIRED",
        description: "Clean up messy commit histories before creating pull requests.",
      },
      {
        id: "chk-1-2-5",
        label: "Explore Beyond: Inspect raw objects in .git/objects using 'git cat-file -t' and '-p'",
        category: "EXPLORE_BEYOND",
        description: "Deconstruct commit objects, tree listings, and blob contents directly from the object database.",
      },
    ],
    nonNegotiables: [
      "Distinction between Working Directory, Staging Index, and HEAD.",
      "Reset (--soft, --mixed, --hard) vs Revert semantics.",
      "DAG recovery via git reflog.",
      "Resolving CLI merge conflicts without GUI crutches.",
    ],
    stressTestQuestions: [
      "How does Git store commits under the hood—are they delta diffs or filesystem tree snapshots?",
      "What are the 3 core object types hashed in .git/objects and how do they link together?",
    ],
  },
  {
    milestoneId: "1.3",
    slug: "1.3-python-runtime-pdb",
    phase: 1,
    sequenceOrder: 3,
    title: "Python Runtime, Memory & PDB Debugging",
    shortTitle: "Python Runtime & PDB",
    summary:
      "Uncover Python's pass-by-object-reference model, mutable default traps, context managers, and step-through terminal debugging with PDB.",
    isLiveInV1: true,
    status: "READY",
    timeLimitMinutes: 25,
    disasterStory: {
      title: "The Leaked Tenant Billing Trap",
      company: "Multi-Tenant SaaS",
      year: "2020",
      narrative:
        "A junior Python developer wrote 'def add_invoice_item(item, items=[]): items.append(item)'. Because default argument expressions are evaluated once at function definition time—not on invocation—the mutable list was shared across every tenant in the process. Customer A saw invoice line items belonging to Customer B. The company lost two enterprise contracts.",
      lesson:
        "Python is pass-by-object-reference. Mutable default arguments create singletons in memory that leak state across requests. If you don't know where objects allocate in RAM, you will leak data.",
    },
    mentalModel: {
      title: "Variables as Names Pointing to Heap Objects",
      coreThesis:
        "In Python, variables are not memory boxes that hold values. They are lightweight names (pointers) bound to PyObject structs on the heap. Reassignment rebinds the name; mutation modifies the existing object.",
      paragraphs: [
        "When you execute 'a = [1, 2, 3]', Python allocates a list object on the heap and binds the label 'a' to it. If you pass 'a' into a function, the function's parameter receives a reference to the exact same heap address. Calling '.append()' mutates the underlying heap memory, which affects all references everywhere.",
        "Reassigning 'a = []' inside a function merely rebinds the local name to a new empty list; it does not touch the original caller object. Understanding this distinction, alongside deterministic resource cleanup via context managers ('with' statement __enter__ and __exit__), separates amateurs from production engineers.",
      ],
      keyTakeaways: [
        "Pass-by-object-reference: Mutating an argument affects all callers sharing that reference.",
        "Default Argument Trap: 'def foo(x=[])' evaluates once at module import time.",
        "Context Managers: Guarantee file/socket cleanup even during unhandled exceptions.",
        "Interactive PDB: Use 'breakpoint()' to inspect call stacks, frame locals, and live memory.",
      ],
    },
    practiceProject: {
      title: "CLI Transaction Ledger with Structured Logging",
      artifactName: "budget_cli.py",
      brief:
        "Build a robust CLI expense tracking ledger using argparse subcommands (add, list, summary), persisting data via context managers to a JSON file. Handle corrupted JSON or missing files gracefully with logging, and debug state mutations using PDB.",
      requirements: [
        "Uses argparse for clean CLI ergonomics (no brittle sys.argv slicing).",
        "Zero bare 'except:' clauses; handles specific IO and JSON errors cleanly.",
        "Uses context managers ('with open(...)') for 100% safe file descriptor cleanup.",
        "Implements structured logging to app.log instead of raw print() statements.",
      ],
      exploreBeyondWarning:
        "Uncle Drill Warning: Uncle Drill tests edge cases beyond this guide. The checklist and practice project cover the foundation, but Uncle Drill will inject unannounced mutations and interrogate edge cases during the live drill. Do not enter assuming simple questions.",
    },
    resources: [
      {
        id: "res-1-3-1",
        milestoneId: "1.3",
        title: "Official Python Docs: pdb — The Python Debugger",
        url: "https://docs.python.org/3/library/pdb.html",
        formatType: "OFFICIAL_DOC",
        learningStyleTags: ["REFERENCE", "PRIMARY_SOURCE"],
        uncleCommentary:
          "Stop littering code with print() statements. Learn 'n' (next), 's' (step), 'c' (continue), and 'w' (where) in pdb.",
      },
      {
        id: "res-1-3-2",
        milestoneId: "1.3",
        title: "Effective Python (Brett Slatkin) — Functions & Mutability",
        url: "https://effectivepython.com/",
        formatType: "BOOK_CHAPTER",
        learningStyleTags: ["DEEP_DIVE", "THEORETICAL"],
        uncleCommentary:
          "Read items on dynamic default arguments and context managers. Essential knowledge for backend service design.",
      },
    ],
    checklist: [
      {
        id: "chk-1-3-1",
        label: "Can explain Python's pass-by-object-reference and variable rebinding vs in-place mutation",
        category: "BASIC",
        description: "Know what happens in memory when passing lists/dicts to functions.",
      },
      {
        id: "chk-1-3-2",
        label: "Can diagnose and fix the mutable default argument trap (e.g. def fn(x=[]))",
        category: "REQUIRED",
        description: "Know why 'def fn(x=None): if x is None: x = []' is the only safe idiom.",
      },
      {
        id: "chk-1-3-3",
        label: "Understand context managers and how __enter__ and __exit__ guarantee resource cleanup",
        category: "REQUIRED",
        description: "Explain what happens to file handles during unhandled exceptions without 'with'.",
      },
      {
        id: "chk-1-3-4",
        label: "Can navigate and debug a running Python process using 'breakpoint()' and PDB commands",
        category: "REQUIRED",
        description: "Step through execution, inspect frames, and evaluate local expressions live in the terminal.",
      },
      {
        id: "chk-1-3-5",
        label: "Explore Beyond: Reference counting (sys.getrefcount) vs Cyclic Garbage Collection in CPython",
        category: "EXPLORE_BEYOND",
        description: "Understand how CPython cleans up cyclic references and tracks memory generation thresholds.",
      },
    ],
    nonNegotiables: [
      "Pass-by-object-reference semantics.",
      "Mutable default argument bugs and remediation.",
      "Deterministic cleanup with context managers.",
      "Terminal debugging via PDB/breakpoint().",
    ],
    stressTestQuestions: [
      "Why does writing 'except Exception:' (or bare except) mask catastrophic bugs in production?",
      "How does Python's cyclic garbage collector detect circular references that reference counting cannot reclaim?",
    ],
  },
  {
    milestoneId: "1.4",
    slug: "1.4-static-typing-pytest",
    phase: 1,
    sequenceOrder: 4,
    title: "Static Typing, Pytest & Modern Tooling",
    shortTitle: "Static Typing & Pytest",
    summary:
      "Eliminate runtime NoneType bugs with strict static typing (mypy --strict), automated edge-case test suites (pytest), and modern 2026 packaging (uv).",
    isLiveInV1: true,
    status: "READY",
    timeLimitMinutes: 25,
    disasterStory: {
      title: "The 3 AM NoneType Production Crash",
      company: "E-Commerce Unicorn",
      year: "2022",
      narrative:
        "An untyped Python payment processing microservice returned None on rare payment provider timeouts instead of raising an exception or returning a Result type. Downstream shipping dispatch attempted 'order.payment.id', crashing with 'AttributeError: NoneType object has no attribute id' on Black Friday. Over 2,000 orders halted for 45 minutes.",
      lesson:
        "Dynamic typing without static type enforcement is technical debt with high compound interest. 'mypy --strict' and parameterized pytest suites turn runtime panics into compile-time errors.",
    },
    mentalModel: {
      title: "Type Safety as Living Executable Documentation",
      coreThesis:
        "Type hints are not comments. When verified by static type checkers, they mathematically prove that data flows through functions without illegal state transformations, null pointer violations, or attribute misspellings.",
      paragraphs: [
        "In large-scale production codebases, unit tests alone are insufficient. Static type checkers (mypy, pyright) inspect call graphs before execution, verifying that every branch returns the expected type and that Optional[T] handles the None branch.",
        "Pairing static typing with parameterized test fixtures in pytest creates self-verifying software. Clean packaging using standard pyproject.toml and locked dependency graphs (uv.lock) guarantees that the code running on your workstation executes identically on production servers.",
      ],
      keyTakeaways: [
        "Strict Static Typing: Treat 'mypy --strict' violations as build failures.",
        "Composition over Inheritance: Favor @dataclass and Protocol over deep class hierarchies.",
        "Parametrized Testing: Test boundary conditions (empty lists, negative numbers, None) with @pytest.mark.parametrize.",
        "Modern Tooling: Use uv for sub-millisecond dependency locking and virtual environment orchestration.",
      ],
    },
    practiceProject: {
      title: "Hardened Transaction Engine & Test Suite",
      artifactName: "transaction_engine",
      brief:
        "Refactor the transaction ledger into a clean src/ package managed via pyproject.toml and uv. Enforce 100% type coverage under 'mypy --strict', format with Ruff, and build a comprehensive pytest suite with fixtures and edge-case parametrization.",
      requirements: [
        "Clean package layout under src/ with pyproject.toml.",
        "100% clean exit (code 0) on 'uv run ruff check .' and 'uv run mypy --strict .'.",
        "Pytest test suite utilizing fixtures and @pytest.mark.parametrize.",
        "Zero untyped function signatures and explicit Handling of Optional[T].",
      ],
      exploreBeyondWarning:
        "Uncle Drill Warning: Uncle Drill tests edge cases beyond this guide. The checklist and practice project cover the foundation, but Uncle Drill will inject unannounced mutations and interrogate edge cases during the live drill. Do not enter assuming simple questions.",
    },
    resources: [
      {
        id: "res-1-4-1",
        milestoneId: "1.4",
        title: "Python Testing with pytest (Brian Okken)",
        url: "https://pragprog.com/titles/bopytest2/python-testing-with-pytest-second-edition/",
        formatType: "BOOK_CHAPTER",
        learningStyleTags: ["HANDS_ON", "PRACTICAL"],
        uncleCommentary:
          "Read chapters 1 through 5. Fixtures, parametrization, and custom markers are what separate professionals from amateur test writers.",
      },
      {
        id: "res-1-4-2",
        milestoneId: "1.4",
        title: "Mypy Documentation: Type Hints Cheat Sheet",
        url: "https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html",
        formatType: "OFFICIAL_DOC",
        learningStyleTags: ["REFERENCE", "PRIMARY_SOURCE"],
        uncleCommentary:
          "Keep this cheat sheet open. You must know how to type Generics, Callables, and Union types without guessing.",
      },
    ],
    checklist: [
      {
        id: "chk-1-4-1",
        label: "Can annotate functions with basic type hints (str, int, list[T], dict[K, V])",
        category: "BASIC",
        description: "Understand type annotations and runtime vs static type checking.",
      },
      {
        id: "chk-1-4-2",
        label: "Know how to handle Optional[T] / T | None to prevent NoneType AttributeError crashes",
        category: "REQUIRED",
        description: "Handle None branches explicitly before accessing properties.",
      },
      {
        id: "chk-1-4-3",
        label: "Can run and resolve errors from 'mypy --strict' across an entire project",
        category: "REQUIRED",
        description: "Zero untyped definitions, zero any types, and clean type narrowing.",
      },
      {
        id: "chk-1-4-4",
        label: "Can write clean pytest suites utilizing fixtures and @pytest.mark.parametrize",
        category: "REQUIRED",
        description: "Test boundary conditions, invalid inputs, and error states cleanly.",
      },
      {
        id: "chk-1-4-5",
        label: "Understand Composition over Inheritance and how to structure dataclasses",
        category: "REQUIRED",
        description: "Avoid brittle class hierarchies by combining small, focused objects.",
      },
      {
        id: "chk-1-4-6",
        label: "Explore Beyond: Structural Subtyping with typing.Protocol vs Nominal Subtyping (abc.ABC)",
        category: "EXPLORE_BEYOND",
        description: "Know how Protocol enables static duck typing and loose coupling in large architectures.",
      },
    ],
    nonNegotiables: [
      "Strict type annotations on all parameters and returns.",
      "Eliminating NoneType crashes with explicit type narrowing.",
      "Writing parameterized pytest test cases.",
      "Clean package structure and dependency locking.",
    ],
    stressTestQuestions: [
      "What problem does committing uv.lock solve that a loose requirements.txt leaves open?",
      "Explain the difference between Nominal Subtyping (abc.ABC) and Structural Subtyping (typing.Protocol).",
    ],
  },
];

export const CANONICAL_PHASES: CurriculumPhase[] = [
  {
    phase: 1,
    title: "Phase 1: Linux, Git & Industrial Python",
    subtitle: "The Foundation of Systems & Terminal Survival",
    status: "ACTIVE",
    description:
      "Zero AI autocomplete. Master Ubuntu server survival, stream processing, Git DAG recovery, and strict static-typed Python.",
    milestones: CANONICAL_PHASE_1_MILESTONES,
  },
  {
    phase: 2,
    title: "Phase 2: CS Fundamentals, Memory & Relational DBs",
    subtitle: "Physical Hardware Cost & PostgreSQL Internals",
    status: "PREVIEW",
    description:
      "Explore binary representations, heap vs stack memory in C, Big-O algorithmic limits, ACID transactions, and query plans.",
    milestones: [],
  },
  {
    phase: 3,
    title: "Phase 3: Systems, HTTP Protocols & Microservices",
    subtitle: "High-Throughput Network Architecture",
    status: "LOCKED",
    description:
      "TCP/IP, HTTP/1.1 vs HTTP/2, socket programming, reverse proxies (Nginx), and distributed service communication.",
    milestones: [],
  },
  {
    phase: 4,
    title: "Phase 4: Observability, Concurrency & High Load",
    subtitle: "Telemetry, Async I/O & Load Resilience",
    status: "LOCKED",
    description:
      "Asyncio internals, distributed tracing, metrics aggregation, rate limiters, and graceful degradation under traffic spikes.",
    milestones: [],
  },
  {
    phase: 5,
    title: "Phase 5: The Capstone Industrial Audit",
    subtitle: "Production War Game & Defense",
    status: "LOCKED",
    description:
      "End-to-end multi-service architecture drill. Defend an active live outage against Uncle Drill in real time.",
    milestones: [],
  },
];

/**
 * Returns all 5 curriculum phases.
 */
export function getPhases(): CurriculumPhase[] {
  return CANONICAL_PHASES;
}

/**
 * Returns all live, interactive milestones across phases.
 */
export function getAllLiveMilestones(): Milestone[] {
  return CANONICAL_PHASE_1_MILESTONES;
}

/**
 * Normalizes milestone lookups by either short ID ("1.1") or full slug ("1.1-ubuntu-survival").
 */
export function getMilestoneById(idOrSlug: string): Milestone | undefined {
  if (!idOrSlug) return undefined;
  const clean = idOrSlug.trim().toLowerCase();

  return CANONICAL_PHASE_1_MILESTONES.find((m) => {
    return (
      m.milestoneId.toLowerCase() === clean ||
      m.slug.toLowerCase() === clean ||
      clean.startsWith(m.milestoneId.toLowerCase() + "-") ||
      clean === m.milestoneId.toLowerCase()
    );
  });
}

/**
 * Computes checklist completion stats and enforces the Hard Gatekeeper Lock rule:
 * isGatekeeperUnlocked is strictly true ONLY when 100% of REQUIRED items are checked.
 */
export function calculateMilestoneProgress(
  milestone: Milestone,
  checkedItemIds: string[]
): MilestoneProgress {
  const checkedSet = new Set(checkedItemIds);
  const requiredItems = milestone.checklist.filter((item) => item.category === "REQUIRED");

  const totalRequired = requiredItems.length;
  const completedRequired = requiredItems.filter((item) => checkedSet.has(item.id)).length;

  const totalItems = milestone.checklist.length;
  const completedItems = milestone.checklist.filter((item) => checkedSet.has(item.id)).length;

  // HARD GATEKEEPER LOCK: 100% of REQUIRED items must be checked
  const isGatekeeperUnlocked = totalRequired > 0 && completedRequired === totalRequired;

  return {
    milestoneId: milestone.milestoneId,
    checkedItemIds,
    totalRequired,
    completedRequired,
    totalItems,
    completedItems,
    isGatekeeperUnlocked,
    lastUpdated: new Date().toISOString(),
  };
}
