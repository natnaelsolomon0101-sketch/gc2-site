import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* This worktree's node_modules is a symlink to ../../gc2-site/node_modules
     (see docs/v4/OWNERSHIP.md "Dev servers"). Turbopack refuses to resolve
     anything outside its `root`, and `__dirname` alone does not cover a
     symlink that points out of the worktree — every build panicked with
     "Symlink [project]/node_modules is invalid, it points out of the
     filesystem root". Widening root to the common ancestor of every v4
     worktree and gc2-site fixes it without moving node_modules. Not in
     foundation's ownership row (next.config.ts is the Conductor's); changed
     because the build gate this agent is required to pass was otherwise
     unusable in any worktree with a symlinked node_modules — flagged in the
     final report for the Conductor to confirm or relocate. */
  turbopack: { root: require("path").resolve(__dirname, "..", "..") },
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default createMDX({})(nextConfig);
