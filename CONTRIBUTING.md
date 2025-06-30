# Contributing to PokéSearch

Thank you for your interest in contributing to PokéSearch! This document provides guidelines and information for contributors.

## Development Workflow

### Branch Naming Convention

Use the following prefixes for branch names:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

Examples:
- `feature/admin-pokemon-management`
- `bugfix/search-typo-handling`
- `refactor/auth-context-optimization`

### Commit Message Format

Use conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
- `feat(search): add fuzzy search with typo tolerance`
- `fix(auth): resolve Google OAuth redirect issue`
- `docs(readme): update installation instructions`

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): your feature description"
   ```

4. **Push Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use descriptive title
   - Fill out PR template
   - Link related issues
   - Request review

### Code Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use custom hooks for reusable logic

### Testing

- Test new features manually
- Ensure existing functionality works
- Test responsive design on different screen sizes
- Verify authentication flows

### Database Changes

- Create new migration files for schema changes
- Never modify existing migration files
- Test migrations on development database
- Document schema changes in PR description

## Feature Development Tasks

Here are the main feature areas that can be developed as separate tasks:

### Core Features
1. **Enhanced Search** (`feature/enhanced-search`)
   - Advanced filters
   - Search history
   - Saved searches

2. **Pokemon Details** (`feature/pokemon-details`)
   - Evolution chains
   - Move sets
   - Breeding information

3. **Collection Management** (`feature/collection-management`)
   - Custom collections
   - Collection sharing
   - Import/export functionality

### User Experience
4. **Profile Enhancements** (`feature/profile-enhancements`)
   - Social features
   - Achievement system
   - Activity feed

5. **Mobile Optimization** (`feature/mobile-optimization`)
   - PWA support
   - Offline functionality
   - Touch gestures

### Admin Features
6. **Advanced Admin Tools** (`feature/advanced-admin`)
   - Bulk operations
   - Analytics dashboard
   - Content moderation

7. **Reporting System** (`feature/reporting-system`)
   - User reports
   - Content flagging
   - Automated moderation

### Performance & Quality
8. **Performance Optimization** (`feature/performance-optimization`)
   - Image optimization
   - Lazy loading
   - Caching strategies

9. **Testing Suite** (`feature/testing-suite`)
   - Unit tests
   - Integration tests
   - E2E tests

10. **Accessibility** (`feature/accessibility`)
    - ARIA labels
    - Keyboard navigation
    - Screen reader support

## Getting Help

- Check existing issues and PRs
- Ask questions in discussions
- Follow the code of conduct
- Be respectful and constructive

Thank you for contributing to PokéSearch! 🚀