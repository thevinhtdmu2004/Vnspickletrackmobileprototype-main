# Git Workflow

## 1. Branching

Recommended branch types:

```text
main
feature/<short-name>
fix/<short-name>
docs/<short-name>
chore/<short-name>
```

## 2. Rules

- `main` should represent the latest stable prototype.
- Major changes should use branches and pull requests.
- PM/BA documentation changes can use `docs/*` branches.
- Source changes should reference an issue.
- Avoid mixing source changes and documentation restructuring in the same PR.

## 3. Commit Message Examples

```text
docs: add project charter
fix: restrict coach revenue access
feat: add member renewal request screen
chore: update repository structure
```

## 4. Pull Request Checklist

```text
[ ] Issue/reference included
[ ] Scope is clear
[ ] No accidental source restructure
[ ] Role access checked
[ ] Demo flow still works
[ ] Documentation updated if needed
```
