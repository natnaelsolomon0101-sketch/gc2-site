#!/usr/bin/env python3
"""Resolve merge conflicts in scripts/qa/killist.sh BASELINE pins by taking the lower pin per file."""
import re
p='scripts/qa/killist.sh'; s=open(p).read()
def resolve(m):
    pins={}
    for block in (m.group(1), m.group(2)):
        for line in block.splitlines():
            mm=re.match(r'\s*"([^"]+)":\s*\((\d+),\s*"([^"]+)"\),', line)
            if mm:
                f,n,o=mm.groups(); n=int(n)
                pins[f]=(min(n,pins[f][0]) if f in pins else n, o)
    return ''.join(f'    "{f}":{" "*max(1,46-len(f))}({n}, "{o}"),\n' for f,(n,o) in pins.items())
s2=re.sub(r'<<<<<<< [^\n]*\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n', resolve, s, flags=re.S)
open(p,'w').write(s2); print("resolved" if s2!=s else "no conflict markers")
