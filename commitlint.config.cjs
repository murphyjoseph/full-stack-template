module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation only changes
        "style", // Code style changes (formatting, missing semicolons, etc)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Changes to build system or dependencies
        "ci", // Changes to CI configuration
        "chore", // Other changes that don't modify src or test files
        "revert", // Revert a previous commit
      ],
    ],
  },
};
