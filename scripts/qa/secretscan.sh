#!/usr/bin/env bash
# 21st key scan (SWARM §7). Must print nothing.
#
# The brief specifies `git grep -n "21st_sk_"`, but that bare prefix appears in
# the brief, the agent files, ENV.md and this script — all of them talking ABOUT
# the scan. A guard that always fires is a guard nobody reads, so this matches
# the real key SHAPE: the prefix followed by a long hex run.
set -u
hits=$(git grep -nE "21st_sk_[0-9a-f]{32,}" -- . ':(exclude)scripts/qa/secretscan.sh' 2>/dev/null || true)
if [ -n "$hits" ]; then
  printf "[21st key committed]\n%s\n" "$hits"
  exit 1
fi
exit 0
