#!/usr/bin/env bash
# Download and unpack the two DILA open-data dumps this corpus is built from.
#
#   LEGI — every consolidated French code, including the Code du travail
#   KALI — every collective agreement, including Syntec (IDCC 1486)
#
# Both are published under the Licence Ouverte and need no API key or account, which is
# why they are used here in preference to the Légifrance API.
#
# Idempotent: downloads resume, and an existing extraction is left alone.
set -euo pipefail

BASE_URL="https://echanges.dila.gouv.fr/OPENDATA"
# Pinned so a rebuild reproduces the same corpus. Newer dumps appear daily; bumping this
# is a deliberate act that re-dates every article, not something to do by accident.
STAMP="20250713-140000"
CODE_DU_TRAVAIL="LEGITEXT000006072050"

RAW="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/data/raw"
mkdir -p "$RAW/ext"

fetch() {
  local name="$1" dataset="$2" file="$3"
  if [ -s "$RAW/$name.tar.gz" ]; then
    echo "$name: already downloaded"
    return
  fi
  echo "$name: downloading $file"
  curl -fsSL -C - --retry 3 -o "$RAW/$name.tar.gz" "$BASE_URL/$dataset/$file"
}

fetch legi LEGI "Freemium_legi_global_$STAMP.tar.gz"
fetch kali KALI "Freemium_kali_global_$STAMP.tar.gz"

# The LEGI dump is every code ever consolidated. Only the Code du travail subtree is
# unpacked: the rest is 20x the size and none of it is in scope.
if [ -d "$RAW/ext/legi" ]; then
  echo "legi: already extracted"
else
  echo "legi: extracting $CODE_DU_TRAVAIL (Code du travail)"
  tar -xzf "$RAW/legi.tar.gz" -C "$RAW/ext" \
    "legi/global/code_et_TNC_en_vigueur/code_en_vigueur/LEGI/TEXT/00/00/06/07/20/$CODE_DU_TRAVAIL/*"
fi

# KALI is unpacked whole: an agreement's articles are scattered by id across the tree,
# so there is no subtree that isolates Syntec.
if [ -d "$RAW/ext/kali" ]; then
  echo "kali: already extracted"
else
  echo "kali: extracting"
  tar -xzf "$RAW/kali.tar.gz" -C "$RAW/ext"
fi

echo "done. Build the corpus with: pnpm corpus:build"
