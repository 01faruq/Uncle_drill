-- ============================================================================
-- UNCLE DRILL MIGRATION 0003: SEED CANONICAL CURRICULUM & CURATED RESOURCES
-- ============================================================================
-- Seeds Phase 1 Milestones (1.1, 1.2, 1.3, 1.4) into curriculum_public & curated_resources.
-- Idempotent UPSERT statements to ensure safe repeatable execution.
-- ============================================================================

-- 1. Insert Phase 1 Milestones into curriculum_public
INSERT INTO curriculum_public (
    milestone_id,
    phase,
    sequence_order,
    title,
    is_live_in_v1,
    mental_model,
    disaster_story,
    primary_resources,
    project_brief,
    time_limit_minutes
) VALUES
(
    '1.1',
    1,
    1,
    'The Ubuntu Server Survival Toolkit & Streams',
    true,
    'A program is nothing magical. It is a Linux process with a PID that reads bytes from stdin (fd 0), manipulates memory, writes bytes to stdout (fd 1) or stderr (fd 2), and terminates with an integer exit code (0–255).',
    'GitLab (2017): An engineer trying to fix a lagged database accidentally ran rm -rf on the live directory, wiping 300GB of production data across 5,000 repositories because shell safety flags were omitted.',
    '[{"title": "MIT Missing Semester: The Shell", "url": "https://missing.csail.mit.edu/2020/shell-tools/", "type": "VIDEO_LECTURE"}, {"title": "How Linux Works (Brian Ward)", "url": "https://nostarch.com/howlinuxworks3", "type": "BOOK_CHAPTER"}]'::jsonb,
    'Write log_analyzer.sh starting with set -euo pipefail to parse 50,000 server logs, filter 5xx and 403 errors, and print the top 5 offending IP addresses cleanly to stdout.',
    25
),
(
    '1.2',
    1,
    2,
    'Git Internals, DAG Recovery & Reflog',
    true,
    'Git is an immutable key-value store with a VCS interface on top. Every file is a blob, every directory is a tree, and every commit is a snapshot pointing to a root tree and parents.',
    'FinTech Outage (2021): An engineer panicked during a merge conflict, ran git push --force on staging, and wiped 48 commits written by four engineers. Reflog was required to recover the dangling commits.',
    '[{"title": "Pro Git: Chapter 10 Git Internals", "url": "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects", "type": "OFFICIAL_DOC"}, {"title": "Learn Git Branching", "url": "https://learngitbranching.js.org/", "type": "INTERACTIVE_SIM"}]'::jsonb,
    'Simulate diverging feature branches with conflicting lines, resolve the conflict cleanly in the CLI without GUI helpers, then recover wiped commits via git reflog after an intentional git reset --hard.',
    25
),
(
    '1.3',
    1,
    3,
    'Python Runtime, Memory & PDB Debugging',
    true,
    'In Python, variables are names bound to PyObject structs on the heap. Reassignment rebinds the name; mutation modifies the existing object. Default arguments evaluate once at module load time.',
    'Multi-Tenant SaaS (2020): An engineer used a mutable list as a default argument (def add_item(i, items=[]):), causing customer invoice lines to leak across accounts in production.',
    '[{"title": "Python PDB Documentation", "url": "https://docs.python.org/3/library/pdb.html", "type": "OFFICIAL_DOC"}, {"title": "Effective Python", "url": "https://effectivepython.com/", "type": "BOOK_CHAPTER"}]'::jsonb,
    'Build budget_cli.py using argparse subcommands and context managers, persisting transactions safely to JSON, handling corrupted files with logging, and debugging state bugs via breakpoint() and PDB.',
    25
),
(
    '1.4',
    1,
    4,
    'Static Typing, Pytest & Modern Tooling',
    true,
    'Type hints mathematically prove that data flows through functions without illegal state transformations, null pointer violations, or attribute misspellings before runtime.',
    'E-Commerce Unicorn (2022): Untyped Python payment microservice returned None on timeout, causing downstream shipping dispatch to crash with AttributeError: NoneType object has no attribute id on Black Friday.',
    '[{"title": "Python Testing with pytest", "url": "https://pragprog.com/titles/bopytest2/", "type": "BOOK_CHAPTER"}, {"title": "Mypy Type Hints Cheat Sheet", "url": "https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html", "type": "OFFICIAL_DOC"}]'::jsonb,
    'Refactor transaction engine into a clean src/ package managed via pyproject.toml and uv. Achieve 100% clean passes on ruff check and mypy --strict, with a parameterized pytest suite.',
    25
)
ON CONFLICT (milestone_id) DO UPDATE SET
    title = EXCLUDED.title,
    mental_model = EXCLUDED.mental_model,
    disaster_story = EXCLUDED.disaster_story,
    primary_resources = EXCLUDED.primary_resources,
    project_brief = EXCLUDED.project_brief,
    time_limit_minutes = EXCLUDED.time_limit_minutes,
    is_live_in_v1 = EXCLUDED.is_live_in_v1;

-- 2. Insert Curated Multi-Modal Resources
INSERT INTO curated_resources (
    milestone_id,
    title,
    url,
    format_type,
    learning_style_tags,
    uncle_commentary
) VALUES
(
    '1.1',
    'The Missing Semester: The Shell & Shell Tools',
    'https://missing.csail.mit.edu/2020/shell-tools/',
    'VIDEO_LECTURE',
    ARRAY['VISUAL', 'HANDS_ON'],
    'Watch lectures 1 and 2. Stop looking for GUI shortcuts; learn how pipes actually transport byte streams between processes.'
),
(
    '1.1',
    'How Linux Works (Brian Ward) — Chapters 1 to 4',
    'https://nostarch.com/howlinuxworks3',
    'BOOK_CHAPTER',
    ARRAY['THEORETICAL', 'DEEP_DIVE'],
    'Read chapters on processes, file descriptors, and kernel signals. If you don''t know what SIGTERM does, you are not ready for production.'
),
(
    '1.2',
    'Pro Git (Scott Chacon) — Chapter 10: Git Internals',
    'https://git-scm.com/book/en/v2/Git-Internals-Git-Objects',
    'OFFICIAL_DOC',
    ARRAY['DEEP_DIVE', 'PRIMARY_SOURCE'],
    'Read Chapter 10 twice. Inspect .git/objects with cat-file. If you understand how a commit points to a tree, you will never panic in Git again.'
),
(
    '1.2',
    'Learn Git Branching (Interactive Visualization)',
    'https://learngitbranching.js.org/',
    'INTERACTIVE_SIM',
    ARRAY['VISUAL', 'HANDS_ON'],
    'Complete the advanced rebase and cherry-pick modules. Visualizing DAG pointer manipulation is non-negotiable.'
),
(
    '1.3',
    'Official Python Docs: pdb — The Python Debugger',
    'https://docs.python.org/3/library/pdb.html',
    'OFFICIAL_DOC',
    ARRAY['REFERENCE', 'PRIMARY_SOURCE'],
    'Stop littering code with print() statements. Learn n, s, c, and w in pdb.'
),
(
    '1.3',
    'Effective Python (Brett Slatkin) — Functions & Mutability',
    'https://effectivepython.com/',
    'BOOK_CHAPTER',
    ARRAY['DEEP_DIVE', 'THEORETICAL'],
    'Read items on dynamic default arguments and context managers. Essential knowledge for backend service design.'
),
(
    '1.4',
    'Python Testing with pytest (Brian Okken)',
    'https://pragprog.com/titles/bopytest2/',
    'BOOK_CHAPTER',
    ARRAY['HANDS_ON', 'PRACTICAL'],
    'Read chapters 1 through 5. Fixtures, parametrization, and custom markers are what separate professionals from amateur test writers.'
),
(
    '1.4',
    'Mypy Documentation: Type Hints Cheat Sheet',
    'https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html',
    'OFFICIAL_DOC',
    ARRAY['REFERENCE', 'PRIMARY_SOURCE'],
    'Keep this cheat sheet open. You must know how to type Generics, Callables, and Union types without guessing.'
)
ON CONFLICT DO NOTHING;
