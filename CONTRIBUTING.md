# Contributing Guide

We welcome contributions to the Node Utils Package! To maintain a smooth workflow and ensure the best quality for the project, please follow these guidelines when contributing:

## 1. Fork the Repository

Start by forking the repository to your own GitHub account.

## 2. Clone Your Fork

Clone your fork of the repository to your local machine:

```bash
git clone https://github.com/varlinor/qkt-node.git
cd qkt-node
```

## 3. Create a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

## 4. Make Changes

Make your code changes, ensuring to follow the existing code style and conventions. Be sure to include relevant tests for your changes in the `tests` directory.

## 5. Run Tests

Before committing your changes, run all tests to ensure nothing is broken:

```bash
pnpm test
```

If you add new features, please write new tests and make sure they pass.

## 6. Commit Your Changes

Commit your changes with a clear and descriptive commit message:

```bash
git commit -m "feat: description of your feature"
```

## 7. Push to Your Fork

Push your branch to your fork on GitHub:

```bash
git push origin feature/your-feature-name
```

## 8. Open a Pull Request

Navigate to the original repository you forked from, and open a pull request. Make sure to fill out the PR template provided, detailing your changes and any additional context needed.

## 9. Review Process

Your pull request will be reviewed by project maintainers. Please be responsive to feedback and make any necessary adjustments to your code.


## Additional Notes

- Make sure your code passes the linter checks.
- Follow the [Semantic Versioning](https://semver.org/) guidelines when making changes that affect the API.
- If you are adding a new dependency, please justify why it is necessary.

Thank you for contributing! Your support and effort help make this project better for everyone.
