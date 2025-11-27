# Contributing Guide

Thank you for contributing to **FastCrew**. As a private, commercial codebase, we maintain high standards for code quality, security, and maintainability.

> **Philosophy:** Leave the code better than you found it. If you see something broken or messy, fix it or flag it.

---

## 🌲 Branching Strategy

We follow a strict **Feature Branch Workflow**. Direct commits to `main` are protected and generally prohibited.

### Naming Convention
Branches must follow this naming pattern:
`type/context-short-description`

**Types:**
-   `feat/`: A new feature (e.g., `feat/auth-login-screen`)
-   `fix/`: A bug fix (e.g., `fix/nav-bar-typo`)
-   `refactor/`: Code change that neither fixes a bug nor adds a feature
-   `chore/`: Maintenance tasks, dependencies, config changes
-   `docs/`: Documentation only changes

**Examples:**
-   ✅ `feat/user-profile-page`
-   ✅ `fix/payment-gateway-timeout`
-   ❌ `update-login` (Too vague, missing type)
-   ❌ `fix-bug` (Which bug?)

---

## 💾 Commit Standards

We enforce **Conventional Commits** to ensure readable history and automated changelog generation.

**Format:**
```text
<type>(<scope>): <subject>
```

**Types:**
-   `feat`: A new feature
-   `fix`: A bug fix
-   `docs`: Documentation only changes
-   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
-   `refactor`: A code change that neither fixes a bug nor adds a feature
-   `perf`: A code change that improves performance
-   `test`: Adding missing tests or correcting existing tests
-   `chore`: Changes to the build process or auxiliary tools

**Example Commits:**
-   `feat(auth): implement clerk sign-in flow`
-   `fix(ui): resolve mobile overflow on dashboard`
-   `style(theme): update primary color hex code`

---

## 🔄 Pull Request (PR) Process

1.  **Self-Review:** Before opening a PR, review your own code. Remove `console.log`s, commented-out code, and ensure variable names are descriptive.
2.  **Sync:** Ensure your branch is up-to-date with `main`.
    ```bash
    git fetch origin
    git rebase origin/main
    ```
3.  **Lint & Typecheck:** Run the following locally to ensure CI passes:
    ```bash
    npm run lint
    npm run typecheck
    ```
4.  **Open PR:**
    -   Title: Use the Conventional Commit format.
    -   Description: Explain **what** changed and **why**. Attach screenshots for UI changes.
5.  **Review:** Request a review from a peer. Address all comments before merging.

---

## 🎨 Code Style & Linting

We use **ESLint** and **Prettier** to enforce code style.

-   **Rule:** No errors or warnings are allowed in the console.
-   **Formatting:** Run `npm run format` to automatically fix formatting issues.
-   **Strictness:** Do not use `any` in TypeScript unless absolutely necessary and documented.

### Best Practices
-   **Components:** Keep components small and focused. Use the `/components` directory for reusable UI.
-   **Server Actions:** Prefer Server Actions for data mutations over API routes where applicable.
-   **Tailwind:** Use utility classes. For complex conditional styling, use `cn()` (clsx + tailwind-merge).

---

**Happy Coding!** 🚀
