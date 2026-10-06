# NexCode — Product Context
**Single Source of Truth for Future Implementation**

- Project: NexCode
- Tagline: Visual AI contribution agent for unfamiliar codebases
- Hackathon: Nebius × NVIDIA Global AI Hackathon
- Track: Coding and Agentic Engineering
- Status: Pre-implementation — context definition only. No code, infra, or integrations built yet.
- This file: `docs/NEXCODE_PRODUCT_CONTEXT.md`
- Purpose: Preserve full product intent so future sessions can implement without re-eliciting requirements. Do not invent details not stated here; log gaps in §22.

---

## 1. Project Overview

NexCode is a visual AI contribution agent that helps a developer safely understand, modify, test, and contribute to a repository they did not create.

Core product promise:

> “NexCode helps developers make safe, high-quality contributions to unfamiliar repositories by learning project conventions, visually mapping the codebase, predicting change impact, using trusted technical documentation when needed, and delivering sandbox-verified, maintainer-ready patches.”

What NexCode does:
- Ingests a GitHub repository (or controlled demo workspace / new-from-idea repo in MVP).
- Builds persistent, inspectable project memory (“Project Brain”).
- Renders an interactive Project Map and semantic Runtime Flow Replay.
- Takes a GitHub issue / feature request / bug report as task input.
- Produces a scoped, risk-aware implementation plan with predicted impact.
- Conditionally consults trusted external docs via Tavily when local repo context is insufficient.
- Implements the approved plan in an isolated workspace via scoped edits + tests.
- Independently verifies via tests, lint, build/type-check, scope, secret, dependency, and contribution-rule checks.
- Presents diff, evidence, predicted-vs-actual impact, model usage, external sources, and a maintainer-readiness report, with optional GitHub-ready branch / draft PR / exportable patch.

What NexCode is NOT:
- Not a generic chatbot.
- Not a generic code generator.
- Not a model marketplace / pricing comparison system.
- Not a clone of Claude Code, Codex, Cursor, OpenCode, Cline, or other coding agents.

Key user questions NexCode must answer:
- How is this repository structured?
- Which files, services, routes, components, tests, and data models are relevant?
- What conventions does this project already use?
- What files should change for this issue?
- What files should not change?
- What is the expected runtime flow for this feature?
- What will likely be affected before code is modified?
- Did the generated code actually work?
- Did the change follow repository rules and contribution guidelines?
- Did the implementation introduce unexpected impact, dependency changes, security problems, or test failures?

---

## 2. Hackathon Alignment

### 2.1 Target track
- Coding and Agentic Engineering track.
- Submission must demonstrate agentic engineering: multi-agent planning, implementation, and independent verification — not single-shot generation.

### 2.2 Sponsor requirements (must be real, not decorative)

**Nebius platform**
- Nebius Token Factory and/or Nebius AI Cloud must be used at runtime.
- Agent reasoning, planning, implementation, review, or orchestration must actually depend on Nebius-hosted inference.
- Decorative Nebius logo / unused API key is not acceptable.

**NVIDIA open-source models**
- At least one NVIDIA model must be used through Nebius infrastructure.
- NVIDIA models must have clear, meaningful roles (see §15 and §9).
- Do not treat NVIDIA as branding or a model dropdown.
- Routing must be explained by task type: planning, code generation, review, fast summaries, reasoning.

**Tavily**
- Tavily must be used functionally as NexCode’s trusted external technical knowledge layer.
- Call Tavily only when local repository information is insufficient.
- Strong use cases: official docs, version-specific framework behavior, migration guidance, API references, security advisories, compatibility info.
- Prefer trusted official documentation domains.
- Results must influence a real engineering decision, plan, or verification step.
- Cache results in Project Brain when appropriate to reduce cost/calls.

**Nebius Sandbox / isolated execution**
- If feasible, use an isolated environment for repo changes, execution, testing, linting, building, verification.
- NexCode must execute and validate changes, not only generate code text.
- Do not claim sandbox functionality unless genuinely implemented.

### 2.3 Submission artifacts required
Final hackathon submission will need:
- Working deployed website URL.
- Public source code repository.
- Detailed README.
- Clear architecture explanation.
- Short public demo video.

This context doc does not define hosting, repo URL, README content, or video script yet — see §22.

---

## 3. Product Problem Statement

Developers joining an unfamiliar full-stack repository face high time-to-first-contribution and high risk of breaking conventions, tests, security rules, or hidden dependencies.

Given a GitHub issue, they typically lack quick answers to:
- Architecture and folder conventions.
- API / component / service / data-model patterns.
- Test, lint, build, CI expectations.
- Auth/authz, error-handling, DB, dependency policies.
- Contribution rules (`README`, `CONTRIBUTING.md`).
- Blast radius of a proposed change.
- Whether their change actually works and is maintainer-acceptable.

Existing generic coding agents optimize for code text output, not safe contribution. They rarely:
- Learn and enforce repo-specific conventions.
- Visually map architecture and runtime flow.
- Predict change impact before editing.
- Verify in isolation against repo gates.
- Produce maintainer-ready evidence (tests, scope checks, security checks, predicted-vs-actual impact).

NexCode addresses this gap by combining project learning, visualization, scoped agents, trusted docs, and independent verification.

---

## 4. Target User

Primary user:
- Developer, student, open-source contributor, hackathon participant, or newly joined engineer who needs to make a safe change in an unfamiliar full-stack repository.

Primary pain:
- Receives a GitHub issue or feature request but does not understand project architecture, folder conventions, API patterns, test patterns, security rules, contribution rules, or dependencies.

Goal:
- Reduce time and risk of first meaningful contribution.

Non-primary users (out of MVP focus):
- Maintainers reviewing patches (secondary beneficiary via maintainer-readiness report, but not the MVP UX focus).
- Teams seeking multi-user collaboration (future).

---

## 5. Product Positioning

- Category: Visual AI contribution agent / agentic contribution assistant.
- Differentiators vs. generic coding agents:
  1. **Visual codebase intelligence** as core feature (§12), not decoration.
  2. **Change impact prediction + predicted-vs-actual reconciliation** (§13).
  3. **Project Brain**: persistent, inspectable, editable project memory (§10).
  4. **Project Skills**: reusable repo-specific rules with observable effect on agent behavior (§11).
  5. **Scoped 3-agent separation** with independent verification and no self-approval (§9).
  6. **Trusted docs layer** via Tavily with citations and caching (§14).
  7. **Sandbox-verified, maintainer-ready patches** with evidence, not just diffs (§16).
  8. **Purposeful Nebius/NVIDIA model routing by task type** with visible usage (§15).

Anti-positioning:
- No generic chatbot UI as core.
- No model marketplace.
- No “paste code, get code” generator without repo context, scope, and verification.

---

## 6. Core User Journey

Canonical MVP flow (normative):

1. **Sign in with GitHub.**
   - Or credible demo-project entry flow for hackathon demo if full OAuth is deferred (must be explicit — see §22).

2. **Select workspace:**
   - Connect existing GitHub repository, OR
   - Open controlled demo repository/workspace, OR
   - Create new repository from a project idea.

3. **Scan → Project Brain.**
   - NexCode scans repo and builds Project Brain (§10).

4. **Visual Project Map.**
   - NexCode generates interactive static map (§12.1).

5. **Task input.**
   - User provides GitHub issue, feature request, bug report, or coding task (free text + optional issue link).

6. **Architect analysis.**
   - Architect Agent analyzes issue together with: repo structure, `README`, `CONTRIBUTING.md`, package/dependency files, test setup, CI config, existing similar features, API routes, components, services, DB models, conventions, Project Brain knowledge.

7. **Clarification.**
   - Architect asks only essential clarification questions when requirements are ambiguous. No interrogation loops.

8. **Plan + impact prediction.**
   - Architect creates: scoped implementation plan, files-to-change, files-not-to-change, risk-sensitive areas, required tests, verification gates, predicted impact, whether Tavily research is required.

9. **Conditional Tavily research.**
   - If external knowledge required: retrieve official docs / release / migration guidance, attach source to plan, save in Project Brain for reuse, show visible effect on engineering decision.

10. **User approval.**
    - User reviews and approves plan (explicit gate before Builder runs).

11. **Builder implementation (isolated).**
    - Modifies only approved files/paths, follows skills/project rules, adds/updates tests, produces reviewable diff. Must not push directly to main.

12. **Verifier validation (independent).**
    - Runs relevant tests, lint, build/type-check; checks scope, unapproved dependencies, secrets, `CONTRIBUTING.md` rules, auth/security behavior; reviews diff; returns `approved` / `needs revision` / `blocked`.

13. **Results display.**
    - Final patch/diff, test evidence, tool execution timeline, agent decision timeline, model usage info, Tavily source info, predicted-vs-actual impact, maintainer-readiness report, optional GitHub-ready branch / draft PR / exportable patch.

Gates:
- No Builder execution without approved plan.
- No “success” claim if Verifier is not `approved`.
- No direct push to main in MVP.

---

## 7. Feature List

### MVP-required (vertical slice)
- GitHub login or credible demo entry.
- One repo / project workspace connection.
- Repo scan → Project Brain generation (inspectable).
- Static visual Project Map (interactive node details, task-relevant + changed-node highlighting).
- Issue/task input.
- Architect plan: scope, non-scope, risks, tests, gates, predicted impact, Tavily need flag.
- Essential clarification questions only.
- Real Tavily official-doc research path (when relevant) with citation + caching.
- User approval step.
- Builder in controlled workspace/sandbox: scoped edits, skill-following, tests, reviewable diff.
- Diff viewer.
- Runtime Flow Replay for one key API/user journey + before/after if feasible.
- Verifier: tests / lint / build / type-check / scope / secrets / dependencies / contribution rules / auth review; `approved` / `needs revision` / `blocked`.
- Predicted-vs-actual impact report.
- Maintainer-readiness report.
- Tool execution timeline + agent decision timeline.
- Model usage visibility (which model for which agent/task).
- Tavily source visibility.
- Demo reset capability.

### Explicitly deferred (see §8, §23)
- Unlimited custom agents, marketplaces, multi-language generality, desktop/VS Code, unrestricted shell, arbitrary-repo generality, full PR automation, collaboration, second-brain.

---

## 8. Non-Goals

For the hackathon MVP, do NOT build:
- Unlimited custom agents.
- Agent marketplace.
- Full dynamic NVIDIA model marketplace.
- Pricing comparison system.
- All programming languages (MVP targets one controlled demo stack — see §19).
- Local filesystem access such as `C:\Users\...`.
- Desktop application.
- VS Code extension.
- Unrestricted shell access.
- Arbitrary repository support (beyond controlled demo + one connected repo path).
- Full production GitHub PR automation (MVP: branch / draft PR / patch export only).
- Complex multi-user collaboration.
- Generic personal second brain.
- Large general web-search product.

If a non-goal is requested later, it belongs in §23 Future Roadmap, not MVP.

---

## 9. Agent Architecture

Exactly three real agents for hackathon MVP. No additional agents in MVP.

### 9.1 Architect Agent
Responsibilities:
- Repo exploration.
- Project Brain generation.
- Task/issue interpretation.
- Requirement clarification (essential only).
- Task decomposition.
- Risk analysis.
- Impact prediction.
- Tavily research decision.
- Implementation plan generation.
- File-scope definition (allow-list + deny-list).
- Required test definition.

Permissions:
- Read/search only.
- No source-code edits.
- No direct GitHub write actions.

Inputs: repo structure, docs, configs, Project Brain, task text.
Outputs: plan, scope, risks, tests, gates, predicted impact, Tavily need + sources.

### 9.2 Builder Agent
Responsibilities:
- Implement approved plan.
- Modify only approved scope.
- Add/update tests.
- Use project skills.
- Work in isolated sandbox/workspace.
- Generate reviewable diff.

Permissions:
- Scoped file modifications only.
- Controlled sandbox commands only.
- No direct merge to main.
- No self-approval.

Inputs: approved plan, scope allow-list, skills, Project Brain subset.
Outputs: diff, test additions, tool logs.

### 9.3 Verifier Agent
Responsibilities:
- Run test / lint / build / type-check checks.
- Review final diff.
- Validate contribution guidelines.
- Check changed-file scope.
- Check secret exposure.
- Check unapproved dependency changes.
- Review auth/security-sensitive behavior.
- Compare predicted vs actual impact.
- Return `approved` / `needs revision` / `blocked`.

Permissions:
- Read/test/review only.
- No application-code edits in MVP.
- No self-override of failed verification.

Critical invariant:
- Builder must never grade or approve its own work. Verifier must be independent; failure must surface as `needs revision` / `blocked`, never silent success.

### 9.4 Orchestration notes
- Strict sequence: Architect → user approval → Builder → Verifier.
- Verifier `needs revision` routes back to Builder with findings (scoped); Verifier `blocked` requires user/architect attention.
- All agent decisions, tool calls, model calls, and Tavily calls must be logged for timeline views.
- No implementation detail (queue, protocol, framework) is decided in this doc — see §22.

---

## 10. Project Brain Architecture

Definition: persistent contextual memory per project containing useful, grounded, inspectable information.

Planned contents (examples, populate from actual repo scan — do not fabricate):
- Stack and languages.
- Frameworks + package versions.
- Folder architecture.
- API conventions.
- Error response conventions.
- UI/component conventions.
- Auth/authz rules.
- DB conventions.
- Test conventions.
- Lint/build commands.
- Contribution rules.
- Dependency policies.
- Important modules.
- Known risk-sensitive modules.
- Project-specific agent skills (refs).
- Trusted Tavily-retrieved official docs (with URL, retrieved date, excerpt).
- Summaries of previous verified NexCode runs.
- User-approved project rules.

Requirements:
- Must be editable/inspectable by user where practical.
- Must not be opaque hidden memory.
- Must be grounded in repo files (traceable where feasible to source file/path).
- Tavily entries must carry source URL + retrieval context + cache rationale.
- Run summaries only from verified runs; never invent history.

Storage/UX not decided here — see §22 (options include repo-local markdown/JSON, DB, or hybrid; UI as panel/inspector).

---

## 11. Skills Architecture

Definition: reusable project-specific skill = structured guidance + constraints that observably shape agent behavior.

A skill includes:
- Purpose.
- Instructions.
- Allowed tools.
- Allowed file paths.
- Project conventions.
- Quality gates.
- Required outputs.
- Limitations.
- Security rules.

Example skills (illustrative; actual set derived from demo repo):
- Next.js page and route builder.
- FastAPI API builder.
- React/Tailwind UI builder.
- Prisma database workflow.
- Pytest test writer.
- Authentication security reviewer.
- GitHub contribution rule checker.
- API error convention enforcer.
- Secure OpenAI integration skill.

Requirements:
- Skills must have observable effect (constrain paths, enforce conventions, require gates/outputs).
- Do not create skills as decorative text cards.
- Skills referenced by Architect plan and enforced in Builder + checked by Verifier.
- Skill provenance: generated from repo scan vs. user-approved — must be visible.

Format/registry not decided — see §22.

---

## 12. Visualization Architecture

Visualization is a core product feature, not decoration. Two layers.

### 12.1 Static Project Map
Visualize connected repo architecture.

Potential node types:
- Folders, files, modules, classes, functions, imports.
- API routes, controllers, services, DB models.
- Frontend components, tests, config, CI workflows, external dependencies.

Must help users understand:
- Module dependencies.
- Route → service wiring.
- Service → data-model access.
- Frontend component → API usage.
- Test coverage mapping (which tests cover which areas).
- Security / business-risk-sensitive areas.
- Task-relevant files/functions.

Interactivity (where feasible):
- Click node → purpose, location, dependencies, callers/users, related tests, risk info.
- Highlight nodes affected by agent plan.
- Highlight nodes changed by final patch.
- Distinguish nodes outside approved scope.

Constraints:
- Must derive from actual repo parse/scan, not hardcoded mock graph for final submission.
- MVP may scope depth (e.g., folder+file+route+component level before full function-level graph) — decide in implementation planning.

### 12.2 Runtime Flow Replay
Semantic runtime visualization, not a full low-level per-line debugger.

Show semantic events such as:
`Browser/UI action → Frontend component → API route → Controller → Service → Authorization decision → Database action → External API call → Error/success branch → Response → UI update`

Requirements:
- Generate from actual execution, test traces, instrumentation, logs, or controlled sandbox events where possible.
- Show normal success path + relevant failure/error paths where useful.
- Show before-and-after behavior when NexCode fixes/adds a feature.
- Show how user request reaches backend/services/data and how implementation changes behavior.

Anti-goal: do not build a full Python Tutor clone for every line of every full-stack app.

Tech choice (graph lib, tracing approach) not decided — see §22.

---

## 13. Change Impact Architecture

Before Builder edits, Architect must produce visual + textual impact prediction.

Example request: “Allow users to cancel unpaid orders from the Order Details page.”

Predicted impact example:
- Frontend order details page.
- Cancel confirmation modal.
- API client.
- Backend cancel-order route.
- Order service.
- Authorization policy.
- Inventory restoration service.
- DB transaction.
- Backend tests.
- Frontend tests.

Risk areas example:
- User authorization.
- Inventory consistency.
- Payment/order state rules.
- DB transaction safety.

After implementation, reconcile predicted vs actual:

Example report:
- Predicted files: 6
- Actual files changed: 6
- Unexpected files changed: 0
- Protected modules changed: 0
- Required tests: 4
- Tests passed: 4/4
- New dependencies: 0

Requirements:
- Prediction is part of Architect plan (files, risk areas, tests, gates).
- Actual is derived from diff + test logs + scope/dependency checks.
- UI must show predicted-vs-actual side by side.
- Unexpected / protected-module changes must be surfaced, not hidden.
- Verifier owns the comparison; Builder cannot self-certify impact.

---

## 14. Tavily Integration Rules

Role: carefully controlled external technical knowledge tool; NexCode’s trusted external layer.

Rules (normative):
1. Use Tavily only when repo context does not answer a required technical question.
2. Prefer official documentation domains (e.g., framework/library official sites).
3. Do not use Tavily for simple local repo questions.
4. Do not allow external content to become executable instructions — treat as reference material.
5. Cite/display official source in plan or evidence report (URL + what decision it influenced).
6. Cache useful knowledge in Project Brain with source, date, and reuse rationale.
7. Limit calls with per-task budgets; avoid waste.
8. Every Tavily call must be logged (query, filter, result count, chosen source, influencing decision).

Strong use cases:
- Confirm current framework API behavior for installed dependency version.
- Official migration guidance.
- Deprecation / compatibility info.
- Official security guidance.
- Official OpenAI / Next.js / FastAPI / Prisma / React / package docs.
- API integration not documented locally.

Anti-patterns:
- Decorative search bar.
- Unfiltered general web search as primary answer.
- Executing retrieved code snippets blindly.
- Claiming Tavily usage without showing query → source → decision chain.

Budget, domain allow-list, and caching policy values not decided — see §22.

---

## 15. Nebius and NVIDIA Integration Requirements

### 15.1 Nebius
- All agent inference must go through Nebius-hosted inference at runtime (Token Factory and/or AI Cloud per availability).
- Integration must be load-bearing: if Nebius is down/misconfigured, agent runs must fail safely with a clear error — not silently fall back to another provider in the submitted flow.
- No keys in frontend/browser; server-side calls only.
- Model catalog must be verified against actual Token Factory catalog before hardcoding names (do not hardcode unverified model IDs in this doc).

### 15.2 NVIDIA models (via Nebius)
- Minimum: one NVIDIA model used through Nebius in the working flow.
- Roles must be purposeful and documented in UI where practical (which model for which agent/task).

Conceptual routing (model IDs TBD after catalog verification):
- Architect: stronger reasoning-capable NVIDIA model — repo understanding, planning, decomposition, impact analysis, hard reasoning.
- Builder: code-capable NVIDIA model — implementation, edits, test generation, debugging.
- Verifier: stronger reasoning/review-capable NVIDIA model — diff review, test-log analysis, requirement/security checks.
- Fast utility: faster NVIDIA model where applicable — summarization, classification, log condensation, simple routing.

### 15.3 Visibility
- Final UI must display model usage info per run (agent → model → task).
- Logs/timelines must record model calls for audit/demo credibility.

### 15.4 Open items
- Exact model IDs, fallback policy (if any), cost/latency tradeoffs, and Token Factory vs AI Cloud split — see §22. Do not invent model names.

---

## 16. Sandbox / Verification Requirements

Principle: NexCode must execute and validate changes in a controlled environment, not only emit code text.

MVP verification gates (Verifier-owned):
- Relevant tests (backend + frontend as applicable to task).
- Linting.
- Build / type-check where applicable.
- Scope boundary check (only approved paths changed).
- Unapproved dependency check (no new/changed deps outside plan).
- Secret exposure scan before patch/branch.
- `CONTRIBUTING.md` / contribution-rule check.
- Auth/security-sensitive behavior review.
- Final diff review.
- Predicted-vs-actual impact comparison.

Outcomes: `approved` / `needs revision` / `blocked`, with reasons and evidence (logs, failing checks).

Sandbox expectations:
- Isolated workspace for repo changes, execution, testing, linting, building.
- Controlled command allow-list; no arbitrary unrestricted shell from browser input.
- No direct push to main; branch / draft PR / patch export only.
- Fail safely: tests/verification failure → report `blocked` / `needs review`, never claim success.
- Do not claim sandbox functionality unless genuinely implemented; document honestly if scope is “controlled workspace” vs full Nebius Sandbox.

Mechanism (container, Nebius Sandbox API, ephemeral workspace, etc.) not decided — see §22.

---

## 17. Security Requirements

Handling repos, source code, GitHub access, and potential secrets requires:

- Never expose Nebius, NVIDIA, Tavily, OpenAI, GitHub, or other API keys in frontend/browser code.
- Never commit secrets into repos.
- Server-side API calls for protected services.
- Selected-repository permissions for GitHub access; prefer GitHub App-style fine-grained access in future.
- No direct push to main; branches / draft PRs / patch exports only.
- Require user approval before consequential actions (plan approval, branch/PR creation at minimum).
- Isolated/sandbox execution where feasible.
- No arbitrary unrestricted shell from browser input; allow-listed commands only.
- Secret scanning before final patch/branch creation.
- Scope checks so agents do not modify unrelated paths.
- Clearly distinguish model suggestions from deterministic verification evidence in UI.
- Fail safely on test/verification failure.
- Validate all external inputs; handle errors explicitly; log structured events.

Compliance/scope notes:
- Full threat model, secret-scanner choice, and GitHub App vs OAuth decision are implementation-phase items — see §22.

---

## 18. MVP Scope

Focus: one controlled demo repository vertical slice that can be finished reliably.

Must demonstrate (see also §7):
- GitHub login or credible demo entry.
- One repo/workspace.
- Project Brain generation.
- Static Project Map.
- One issue/task input.
- Architect plan + impact prediction.
- One real Tavily official-doc decision if relevant to the task.
- User approval gate.
- Builder in controlled workspace/sandbox.
- Diff viewer.
- Runtime flow for one key journey (+ before/after if feasible).
- Verifier gates + predicted-vs-actual impact.
- Maintainer-ready report.
- Nebius/NVIDIA usage visibility.
- Demo reset.

Recommended demo stack: full-stack ecommerce / order-management app (final stack choice deferred to implementation planning; keep small enough to test/lint/build quickly).

Out of MVP: see §8 Non-Goals. In particular: no multi-agent generality, no marketplace, no multi-language matrix, no desktop/extension, no unrestricted shell, no arbitrary-repo generality, no full PR automation, no collaboration, no second-brain.

---

## 19. Demo Scenario

Recommended demo repository: full-stack ecommerce / order-management application (controlled, seeded).

Recommended demo task (canonical for MVP testing):

> “Allow users to cancel unpaid orders from the Order Details page. Only the order owner can cancel. Cancellation restores inventory. Add frontend and backend tests.”

Why this task: exercises frontend + API + service + authz + DB transaction + inventory consistency + tests — ideal for impact prediction, skills, runtime flow, and verifier gates.

Expected demo beats (narrative, not a script to fake):
1. Connect demo repo → Brain + Map appear.
2. Paste issue → Architect plan with scope, risks, predicted impact, Tavily citation (e.g., framework/ORM transaction or routing docs if version-sensitive).
3. Approve plan → Builder edits scoped files + tests in sandbox.
4. Show diff + runtime flow (cancel success path + unauthorized/paid-order error branches).
5. Verifier runs gates → predicted-vs-actual + maintainer report.
6. Export branch / draft PR / patch; reset demo.

Demo data/reset: must provide clean reset capability so judges can re-run. Seed data and reset mechanism TBD — see §22.

---

## 20. Success Criteria

MVP is successful if a judge/maintainer can:

- Understand repo structure from Map + Brain without reading all code.
- See a scoped plan with explicit non-scope, risks, tests, gates, and predicted impact before any edit.
- Trace at least one Tavily source → engineering decision (query, source, effect visible).
- Approve plan through an explicit gate.
- Inspect a scoped diff produced in an isolated workspace (no main push).
- Watch a semantic runtime flow for the key journey (success + relevant error branch).
- Verify deterministic evidence: tests / lint / build logs, scope / secret / dependency / contribution checks.
- Compare predicted-vs-actual impact with zero hidden changes.
- Read a maintainer-readiness report and decide to merge / request changes.
- See which Nebius-hosted NVIDIA model powered each agent/task.
- Reset and re-run the demo cleanly.

Submission succeeds if it also ships: deployed URL, public repo, README, architecture explanation, demo video — all consistent with actually implemented behavior (no mocked sponsor flows, no fake features).

---

## 21. Risks and Mitigations

| Risk | Effect | Mitigation (planned) |
|---|---|---|
| Nebius / NVIDIA model availability or catalog mismatch | Agents cannot run as designed; hardcoded model names break | Verify Token Factory catalog first; no hardcoded IDs until confirmed; load-bearing integration with safe failure messaging; display actual model used |
| Sandbox unavailable / too slow for hackathon timeline | Cannot genuinely execute/verify; credibility loss if faked | Scope to controlled workspace with allow-listed commands; honestly document sandbox depth; never claim unverified isolation; keep demo repo small/fast |
| Tavily overuse / cost / noise | Latency, cost, low-quality sources driving decisions | Call only on repo-insufficient questions; official-domain preference; per-task budget; caching in Brain; show query→source→decision chain |
| Arbitrary-repo generality blows scope | Parser, visualizer, verifier matrix explodes | MVP pins one controlled demo repo/stack; single vertical slice; defer generality to roadmap |
| Visualization becomes decoration | Judges see static mock graph | Derive Map/flow from actual scan/traces; node click details; plan/changed highlighting; honest scoping of depth |
| Agent scope creep / destructive edits | Builder touches protected paths, secrets, main | Allow-list scopes, no-main-push invariant, secret/scope/dependency gates in Verifier, user approval gates |
| Secret / key leakage | Credential exposure via frontend, logs, commits | Server-only keys, `.env.example` only, secret scan gate, selected-repo permissions, input validation |
| Test/lint/build flakiness in demo | Verifier cannot produce clean evidence | Keep demo stack minimal and fast; pin versions; reset capability; fail-safe `blocked` status instead of false success |
| Time overrun from building too much | Incomplete MVP, rushed demo | Enforce §8 non-goals; vertical slice first; no marketplaces/extensions/collab in MVP |
| Claimed-but-unbuilt features | Disqualification / loss of trust | Engineering honesty rule: document gaps, do not mock sponsor integrations in submitted flow |

---

## 22. Open Questions / Decisions Needed

No implementation may assume answers here. Owner confirmation required before build.

1. **Nebius catalog:** What exact Token Factory / AI Cloud models are available at build time? Which NVIDIA reasoning, code, and fast models to assign to Architect/Builder/Verifier/utility?
2. **Nebius Sandbox:** Is Nebius Sandbox API available for this hackathon? If not, what is the approved “isolated workspace” substitute (containers, ephemeral VM, local demo runner) and how is isolation honestly described?
3. **Demo stack:** Exact demo repo stack (e.g., Next.js + FastAPI + Prisma/Postgres vs alternatives), versions, and seed location (new vs existing template)?
4. **GitHub integration depth:** Full OAuth App + selected-repo permissions + branch/draft-PR creation for MVP, or scoped demo-mode with patch export only?
5. **New-from-idea repo path:** Is “create new repo from idea” in MVP or deferred? What generator/scaffolder if included?
6. **Project Brain storage:** Repo-local markdown/JSON vs DB vs hybrid? Editable UI shape? Versioning of Brain entries?
7. **Skills format:** File format, registry location, authoring flow (auto-generated vs user-approved), enforcement mechanism?
8. **Visualization stack:** Graph library, parsing strategy (AST vs import-graph vs runtime trace), depth limits, and trace/instrumentation approach for Runtime Replay?
9. **Tavily policy values:** Domain allow-list, per-task call budget, cache TTL/invalidation, and “repo-insufficient” decision threshold?
10. **Model fallback:** Any non-NVIDIA fallback allowed on Nebius outage, or hard-fail with message? Cost/latency logging requirements?
11. **Auth for demo:** Real GitHub OAuth on day one vs demo-login shim with honest labeling?
12. **Deployment target:** Where will the demo website be deployed? What public repo hosts code? README/architecture diagram owners?
13. **Verifier gates set:** Exact test/lint/build commands per stack, secret-scanner tool, dependency-policy rule, `CONTRIBUTING.md` checklist encoding?
14. **Runtime Replay source:** Logs vs instrumentation vs test-trace capture? Before/after capture mechanism?
15. **Reset semantics:** What does “demo reset” wipe (workspace, Brain, Tavily cache, branches) vs preserve?
16. **Frontend/backend split and typing:** Language, framework, API contract, and typed-interface conventions for implementation?
17. **Observability:** Structured event schema for tool/agent/model/Tavily timelines and log retention?
18. **Security review scope:** Threat-model depth, GitHub App vs PAT, secret-handling audit for submission?

---

## 23. Future Roadmap

Post-MVP only. Do not pull into hackathon scope without explicit re-planning.

- Broader repo support: multi-language, monorepo, large-repo incremental indexing.
- Full GitHub automation: checks, auto-branch, draft→ready PR, review comments, CI integration.
- Richer Project Map: function-level graph, incremental updates, risk overlays, coverage overlays.
- Deeper Runtime Replay: multi-journey capture, prod-like trace import, performance annotations.
- Skills ecosystem: shareable skills, skill versioning, org-level skill packs, skill effectiveness metrics.
- Brain evolution: cross-run learning, rule promotion workflow, conflict resolution, team-shared Brain.
- Model routing advances: cost/latency-aware routing, eval-driven model selection (NVIDIA models via Nebius only for sponsor-relevant paths).
- Collaboration: multi-user review, comments, maintainer workflows.
- IDE integrations: VS Code extension, local CLI companion (no unrestricted shell; preserve sandbox guarantees).
- Deployment/ops: self-hosting, SSO, audit logs, policy controls.
- Additional demo domains beyond ecommerce/order-management.

---

## Appendix — Engineering Quality Bar (applies at implementation time)

- Clean modular architecture: separate frontend, backend, agent orchestration, integrations, visualization, domain logic.
- Clear naming, predictable folders; no giant files or deep nesting.
- Typed interfaces/models where applicable; validate external inputs; explicit error handling.
- Meaningful structured logs/events for agent, tool, model, Tavily actions.
- Tests for non-trivial logic; reusable components/services; no duplicate logic.
- Env via variables + `.env.example` only — never real secrets.
- Document architecture and key decisions; comments only for non-obvious choices.
- UI: clean, accessible, responsive, consistent.
- Honesty: no fake features, no mocked sponsor integrations in submitted flow; document incompleteness openly; keep decisions traceable.
