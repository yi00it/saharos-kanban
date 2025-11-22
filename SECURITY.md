# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| < 1.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please email [security@saharos.dev](mailto:security@saharos.dev) (or open a private security advisory on GitHub).

**Please do NOT open public issues for security vulnerabilities.**

We will respond within 48 hours and work with you to address the issue promptly.

## Security Best Practices

### When Using Custom Renderers

**⚠️ CRITICAL:** Custom render functions can introduce XSS vulnerabilities if not implemented correctly.

**ALWAYS escape user content:**

```javascript
// ✅ SAFE - Using escapeHtml
renderCard: (card, helpers) => {
  const el = helpers.createElement('div', 'sk-card');
  el.dataset.cardId = String(card.id);
  el.innerHTML = `<h3>${helpers.escapeHtml(card.title)}</h3>`;
  return el;
}

// ❌ UNSAFE - Direct insertion without escaping
renderCard: (card, helpers) => {
  const el = helpers.createElement('div', 'sk-card');
  el.innerHTML = `<h3>${card.title}</h3>`; // XSS VULNERABILITY!
  return el;
}
```

### Required Attributes for Custom Cards

Custom card renderers **MUST** include:

1. **Class:** `.sk-card` (required for drag & drop)
2. **Attribute:** `data-card-id="${card.id}"` (required for identification)

```javascript
renderCard: (card, helpers) => {
  const el = helpers.createElement('div');
  
  // ✅ REQUIRED
  el.className = 'sk-card my-custom-class';
  el.dataset.cardId = String(card.id);
  
  // Your custom content (ESCAPED!)
  el.innerHTML = `<div>${helpers.escapeHtml(card.title)}</div>`;
  
  return el;
}
```

### LocalStorage Security

- Data loaded from localStorage is automatically validated
- Invalid data is rejected and cleared
- Use unique `storageKey` to avoid conflicts

### Input Validation

All CRUD methods validate inputs:

```javascript
try {
  board.addCard({
    id: '',  // ❌ Will throw error
    title: '',  // ❌ Will throw error
    columnId: 'todo'
  });
} catch (error) {
  console.error(error); // Validation failed
}
```

## Known Security Features

### v1.1.3+
- ✅ XSS prevention in custom renderers with validation
- ✅ LocalStorage injection prevention
- ✅ CSS selector injection prevention (CSS.escape)
- ✅ Input validation for all CRUD operations
- ✅ Error boundaries with safe fallbacks

### v1.1.2
- ✅ No innerHTML usage in default renderers
- ✅ Safe DOM construction

## Security Checklist for Contributors

Before submitting code:

- [ ] No `innerHTML` with unescaped user data
- [ ] All user input is validated
- [ ] DOM queries use `escapeSelector()` for user IDs
- [ ] Custom render examples include `helpers.escapeHtml()`
- [ ] No `eval()` or `Function()` constructors
- [ ] No external script loading without validation

## Audit History

- **2025-01-XX:** Comprehensive security review and fixes (v1.1.3)
  - Fixed memory leaks
  - Added input validation
  - Added CSS selector escaping
  - Added localStorage validation
- **2024-XX-XX:** Initial security review (v1.0.0)

## Contact

For security concerns: [security@saharos.dev](mailto:security@saharos.dev)
