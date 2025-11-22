# Contributing to Saharos Kanban

Thank you for your interest in contributing to Saharos Kanban! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Important Notes](#important-notes)

---

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other community members

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**
- Clear, descriptive title
- Steps to reproduce the behavior
- Expected vs actual behavior
- Code snippet demonstrating the issue
- Browser and version information
- Screenshots if applicable

**Example:**
```markdown
**Bug:** Drag & drop not working with custom renderCard

**Steps to reproduce:**
1. Create custom renderCard function
2. Return element without .sk-card class
3. Try to drag card

**Expected:** Card should drag
**Actual:** Nothing happens

**Code:**
\`\`\`javascript
renderCard: (card) => {
  const div = document.createElement('div');
  // Missing .sk-card class!
  div.innerHTML = card.title;
  return div;
}
\`\`\`

**Environment:**
- Browser: Chrome 120
- Version: 1.0.0
```

### 💡 Suggesting Features

Feature requests are welcome! Please:
- Use a clear, descriptive title
- Explain the use case
- Describe the expected behavior
- Consider if it fits the project's zero-dependency philosophy

### 📝 Improving Documentation

Documentation improvements are always appreciated:
- Fix typos or unclear explanations
- Add missing examples
- Improve code comments
- Translate documentation (future)

### 🔧 Code Contributions

See [Development Setup](#development-setup) below.

---

## Development Setup

### Prerequisites

- Node.js 16+ 
- npm, yarn, or pnpm
- Git

### Setup Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/saharos-kanban.git
cd saharos-kanban

# 3. Add upstream remote
git remote add upstream https://github.com/saharos/saharos-kanban.git

# 4. Install dependencies
npm install

# 5. Run development server
npm run dev

# 6. Open examples in browser
# Navigate to http://localhost:5173/examples/basic.html
```

### Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build library
npm run lint       # Lint TypeScript
npm run lint:fix   # Fix linting issues
npm run format     # Format code with Prettier
```

---

## Coding Guidelines

### Architecture Principles

1. **Zero Dependencies** - Never add external dependencies
2. **No Full Re-renders** - Only update changed DOM elements
3. **Events for Everything** - All mutations must emit events
4. **TypeScript Internal** - Use TypeScript, output JavaScript
5. **Minimal DOM** - Keep DOM footprint small
6. **Native APIs** - Use Pointer Events, no abstractions

### Code Style

- **TypeScript:** Use strict mode, explicit types
- **Formatting:** Prettier (automatic with `npm run format`)
- **Linting:** ESLint (automatic with `npm run lint`)
- **Naming:** 
  - Classes: `PascalCase`
  - Functions: `camelCase`
  - Constants: `SCREAMING_SNAKE_CASE`
  - Private: prefix with `_` (if needed)

### File Organization

```
src/
├── core/          # Core logic (TypeScript)
│   ├── types.ts   # Type definitions
│   ├── events.ts  # Event bus
│   ├── state.ts   # State management
│   ├── dnd.ts     # Drag & drop
│   └── Kanban.ts  # Main class
├── dom/           # DOM manipulation
│   ├── render.ts  # Rendering
│   └── a11y.ts    # Accessibility
└── styles/        # CSS files
    └── index.css  # Core styles
```

### Writing Tests (Future)

When tests are added:
```bash
npm test           # Run tests
npm run test:watch # Watch mode
npm run coverage   # Coverage report
```

---

## Pull Request Process

### Before Submitting

1. **Check existing issues/PRs** - Avoid duplicates
2. **Discuss major changes** - Open an issue first
3. **Follow coding guidelines** - Run linter and formatter
4. **Test thoroughly** - Verify all examples still work
5. **Update documentation** - If adding/changing features

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in Chrome/Firefox/Safari
- [ ] All examples work correctly
- [ ] No console errors
- [ ] Drag & drop works
- [ ] Keyboard navigation works

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new dependencies added
- [ ] Linter passes
- [ ] Prettier formatting applied
```

### Commit Messages

Use conventional commits:
```
feat: add card filtering functionality
fix: resolve drag & drop on Safari
docs: improve custom rendering examples
refactor: simplify state manager logic
style: format code with prettier
test: add unit tests for event bus
```

### Review Process

1. Maintainer reviews code
2. Feedback/changes requested (if needed)
3. You make updates
4. Approved and merged

---

## Important Notes

### ⚠️ Custom Renderers

When modifying render functions, remember:

**For cards:**
```javascript
// REQUIRED
element.className = 'sk-card';
element.dataset.cardId = String(card.id);
```

**For columns:**
```javascript
// Automatically added by library
element.dataset.columnId = String(column.id);
```

### 🚫 What NOT to Do

- ❌ Add npm dependencies
- ❌ Remove TypeScript strict mode
- ❌ Break existing public APIs
- ❌ Re-render entire board unnecessarily
- ❌ Remove accessibility features
- ❌ Ignore linting errors

### ✅ What TO Do

- ✅ Write clear, commented code
- ✅ Follow existing patterns
- ✅ Test in multiple browsers
- ✅ Update documentation
- ✅ Maintain backward compatibility
- ✅ Add examples for new features

---

## Project Structure Reference

```
saharos-kanban/
├── src/
│   ├── core/
│   │   ├── Kanban.ts          # Main class (~600 lines)
│   │   ├── types.ts           # All TypeScript definitions
│   │   ├── events.ts          # Event bus system
│   │   ├── state.ts           # State management
│   │   ├── dnd.ts             # Drag & drop engine
│   │   ├── storage.ts         # LocalStorage
│   │   └── plugins.ts         # Plugin system
│   ├── dom/
│   │   ├── render.ts          # Rendering system
│   │   └── a11y.ts            # Accessibility
│   ├── styles/
│   │   ├── index.css          # Core styles
│   │   ├── theme-dark.css     # Dark theme
│   │   ├── theme-light.css    # Light theme
│   │   └── theme-colorful.css # Colorful theme
│   └── index.ts               # Main entry point
├── examples/                   # Live examples
│   ├── index.html             # Examples gallery
│   ├── basic.html             # Basic demo
│   ├── api-demo.html          # CRUD API demo
│   ├── custom-render.html     # Custom rendering
│   ├── a11y.html              # Accessibility demo
│   └── plugins.html           # Plugin system demo
├── dist/                       # Build output (gitignored)
├── CHANGELOG.md               # Version history
├── LICENSE                    # MIT License
└── README.md                  # Main documentation
```

---

## Questions?

- **General questions:** Open a GitHub Discussion
- **Bug reports:** Open a GitHub Issue
- **Feature requests:** Open a GitHub Issue with [Feature Request] prefix
- **Security issues:** See SECURITY.md (if we create one)

---

## Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Credited in release notes
- Mentioned in README (for significant contributions)

Thank you for helping make Saharos Kanban better! 🚀

---

**Project Master Spec:** See `saharos-kanban.md` for complete technical specification.
