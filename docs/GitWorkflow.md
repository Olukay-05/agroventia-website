# Git Workflow Documentation

This document explains the recommended Git workflow for the AgroVentia project.

## Initial Setup

### 1. Clone the Repository (for team members)

If you're a team member joining the project:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 2. Initialize the Repository (for repository creator)

If you're setting up the repository for the first time:

```bash
cd "c:\Users\user\Desktop\work\Projects\Clients\AgroVentia Inc\AVI-inc"
git init
git add .
git commit -m "Initial commit: AgroVentia homepage with quote request functionality"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

## Branching Strategy

We use a simplified Git branching strategy:

- `main` - Production-ready code
- Feature branches - For developing new features
- Hotfix branches - For urgent fixes to production code

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Creating a Hotfix Branch

```bash
git checkout -b hotfix/your-hotfix-name
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/new-feature
```

### 2. Make Changes

```bash
# Make your code changes
git add .
git commit -m "Add new feature"
```

### 3. Push to Remote Repository

```bash
git push origin feature/new-feature
```

### 4. Create a Pull Request

Go to GitHub and create a pull request from your feature branch to `main`.

### 5. Code Review and Merge

After code review and approval, merge the pull request to `main`.

### 6. Pull Latest Changes

```bash
git checkout main
git pull origin main
```

## Commit Message Guidelines

Follow these guidelines for writing commit messages:

1. Use the imperative mood ("Add feature" not "Added feature")
2. Keep the first line under 50 characters
3. Use a blank line after the first line
4. Wrap subsequent lines at 72 characters
5. Reference issues or tickets when applicable

Example:

```
Add quote request functionality

- Implement QuoteRequestContext for state management
- Create useScrollToSection hook for smooth navigation
- Update ProductsSection and ContactSection components
- Add comprehensive documentation

Closes #123
```

## Handling Conflicts

When you encounter merge conflicts:

1. Pull the latest changes:

   ```bash
   git pull origin main
   ```

2. Resolve conflicts in your editor

3. Add resolved files:

   ```bash
   git add .
   ```

4. Commit the merge:

   ```bash
   git commit
   ```

5. Push your changes:
   ```bash
   git push origin your-branch-name
   ```

## Best Practices

1. **Frequent Commits**: Make small, focused commits
2. **Descriptive Messages**: Write clear, concise commit messages
3. **Regular Syncing**: Pull from main regularly to avoid large conflicts
4. **Feature Branches**: Always work on feature branches, never directly on main
5. **Code Review**: Always have code reviewed before merging
6. **Testing**: Ensure all tests pass before pushing changes

## Useful Git Commands

### Status and History

```bash
git status              # Check repository status
git log                 # View commit history
git log --oneline       # View compact commit history
git diff                # View unstaged changes
git diff --staged       # View staged changes
```

### Branch Management

```bash
git branch              # List branches
git branch -a           # List all branches (local and remote)
git branch -d branch-name  # Delete local branch
git push origin --delete branch-name  # Delete remote branch
```

### Undo Operations

```bash
git checkout -- file-name      # Discard changes in working directory
git reset HEAD file-name       # Unstage a file
git reset --soft HEAD~1        # Undo last commit, keep changes
git reset --hard HEAD~1        # Undo last commit and all changes
```

## Deployment

The project is configured for deployment on Vercel. Any changes pushed to the `main` branch will automatically trigger a new deployment.

For manual deployment:

1. Ensure all changes are committed and pushed
2. Go to your Vercel dashboard
3. The deployment should start automatically, or you can trigger a manual deployment

## Troubleshooting

### "Permission denied" Errors

Ensure you have proper permissions to the repository and you're using the correct authentication method (SSH keys or personal access tokens).

### "Merge conflicts" Errors

Follow the conflict resolution steps above.

### "Remote rejected" Errors

Make sure you're working on a feature branch and not directly on `main`. Also ensure your branch is up to date with `main`.

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows)
