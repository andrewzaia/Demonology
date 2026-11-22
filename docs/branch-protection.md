# Main branch protection

The active main ruleset requires a pull request and the release-gate status check, blocks force pushes and deletion, and has no bypass actors. The validation workflow uses that exact job name. Keep mandatory human approval count at zero for a single maintainer. Do not bypass failed checks.

The initial dependency installation can generate a lockfile; commit it and switch to npm ci before production release.
