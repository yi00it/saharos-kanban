# Contributing to Saharos Kanban

Thank you for your interest in contributing to Saharos Kanban! We welcome contributions from the community.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

- Check existing issues first to avoid duplicates
- Use a clear, descriptive title
- Include steps to reproduce the bug
- Provide browser/environment details
- Include code samples when relevant

### Suggesting Features

- Check if the feature has already been requested
- Explain the use case clearly
- Consider if it fits the project's scope (zero dependencies, performance-first)

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Run tests and linting**:
   ```bash
   npm run lint
   npm run format
   npm test
   ```
6. **Commit** with clear messages following conventional commits
7. **Push** to your fork
8. **Open a Pull Request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/saharos-kanban.git
cd saharos-kanban

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint
npm run lint:fix

# Format code
npm run format

# Build library
npm run build
```

## Coding Standards

### TypeScript
- Use strict mode
- Avoid `any` types
- Provide JSDoc comments for public APIs
- Use type guards for validation

### Security
- **ALWAYS** use `helpers.escapeHtml()` for user content in custom renderers
- **ALWAYS** use `escapeSelector()` for DOM queries with user IDs
- Validate all inputs in CRUD methods
- Never use `innerHTML` with unescaped user data

### Performance
- Minimize DOM operations
- Use incremental updates where possible
- Avoid unnecessary re-renders
- Profile changes for large boards (1000+ cards)

### Testing
- Write unit tests for new functions
- Add integration tests for features
- Test accessibility with keyboard navigation
- Test on multiple browsers

## Project Structure

```
saharos-kanban/
├── src/
│   ├── core/          # Core logic (State, Events, DnD, Plugins)
│   ├── dom/           # Rendering & Accessibility
│   └── styles/        # CSS themes
├── examples/          # Demo HTML files
├── tests/            # Test files
└── dist/             # Build output
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build/tooling changes

**Examples:**
```
feat(plugins): add card filtering plugin
fix(a11y): resolve memory leak in event listeners
docs(readme): update installation instructions
perf(render): optimize card rendering for 1000+ cards
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` with release notes
3. Create git tag: `git tag v1.x.x`
4. Push tag: `git push --tags`
5. Publish to npm: `npm publish`

## Questions?

- Open an issue for questions
- Check existing documentation in `/docs`
- Review examples in `/examples`

Thank you for contributing! 🎉
