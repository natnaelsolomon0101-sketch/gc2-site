#!/usr/bin/env bash
# 21st API key scan. Must print nothing.
# Matches the real key SHAPE (prefix + long hex), not the bare prefix — the
# prefix appears in docs and in this script, and a guard that fires on its own
# documentation is a guard nobody reads.
set -u
hits=$(git grep -nE "21st_sk_[0-9a-f]{32,}" -- . ':(exclude)scripts/qa/secretscan.sh' 2>/dev/null || true)
if [ -n "$hits" ]; then
  printf "[21st key committed]\n%s\n" "$hits"
  exit 1
fi
exit 0
