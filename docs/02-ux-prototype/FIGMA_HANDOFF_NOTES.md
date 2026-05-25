# Figma Handoff Notes

## 1. Current State

Figma has been disconnected from GitHub.

The repository is now treated as a controlled source repository.

## 2. Why Disconnected

Figma push previously removed manually created documentation files.

After disconnecting:

- Source changes should be controlled through Git.
- Documentation should remain safe.
- Prototype Freeze v1 can be preserved.

## 3. Recommended Future Figma Usage

Use Figma for:

- Visual design review.
- Prototype exploration.
- UX improvement.
- Screen documentation.

Do not use Figma to push directly to `main` unless intentionally re-opening prototype generation.

## 4. If Future Figma Export Is Needed

Recommended process:

```text
1. Export or push to a separate branch.
2. Review diff.
3. Manually merge approved changes.
4. Do not overwrite main directly.
```

## 5. Documentation Safety

Use GitHub Issues BA-00 → BA-07 as durable BA source of truth.
