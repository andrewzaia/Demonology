# Main branch protection

Recommended repository branch ruleset: protect-main, Active, target default branch. Restrict deletions, block force pushes, require a pull request with zero mandatory human approvals for this single-maintainer repository, and require the Build and validate check after its first successful run. Do not exempt automation accounts from required checks. Keep bypass permissions empty unless a documented emergency recovery policy is needed.

The initial CI runs without a lockfile only to establish the baseline. Commit the generated package-lock.json and switch to npm ci exclusively before treating the pipeline as production-ready. Owner approval remains required for public indexing and final editorial release.
