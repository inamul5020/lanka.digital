# 🚀 Lanka.Digital Setup Guide

## Prerequisites

Before setting up Lanka.Digital, ensure you have the following installed:

### Required Software
- **Node.js 18+**: [Download from nodejs.org](https://nodejs.org/)
- **Git**: [Download from git-scm.com](https://git-scm.com/)
- **VS Code** (recommended): [Download from code.visualstudio.com](https://code.visualstudio.com/)

### Optional but Recommended
- **Docker**: For future backend development
- **GitHub Desktop**: GUI for Git operations

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for project and dependencies
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

---

## Quick Start (5 minutes)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lanka.digital
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173` (default Vite port)

---

## Detailed Setup Instructions

### Step 1: Clone and Navigate
```bash
# Clone the repository
git clone https://github.com/your-username/lanka.digital.git

# Navigate to project directory
cd lanka.digital

# Verify you're in the right place
ls -la
```

### Step 2: Node.js Setup
```bash
# Check Node.js version
node --version
# Should be 18.0.0 or higher

# Check npm version
npm --version
# Should be 8.0.0 or higher
```

### Step 3: Install Dependencies
```bash
# Install all project dependencies
npm install

# This will install:
# - React 18 and React DOM
# - TypeScript and related tools
# - Vite (build tool)
# - Tailwind CSS
# - Lucide React (icons)
# - Supabase JS client
# - ESLint and Prettier
```

### Step 4: Environment Setup
```bash
# Copy environment template (if exists)
cp .env.example .env.local

# Edit environment variables (optional for frontend-only)
nano .env.local
```

### Step 5: Start Development Server
```bash
# Start the development server
npm run dev

# Expected output:
#   VITE v5.4.8  ready in 167 ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
```

---

## Project Structure Overview

```
lanka.digital/
├── src/                    # Source code
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── data/             # Mock data and types
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── docs/                  # Documentation
├── public/               # Static assets
├── package.json          # Project dependencies
├── vite.config.ts       # Build configuration
├── tailwind.config.js   # Tailwind CSS config
└── tsconfig.json        # TypeScript configuration
```

---

## Development Workflow

### Daily Development
```bash
# Start development server
npm run dev

# Open http://localhost:5173 in browser
# Make changes - hot reload will update automatically
```

### Code Quality Checks
```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint -- --fix

# Type checking
npm run typecheck
```

### Building for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## Common Setup Issues

### Issue: Node.js Version Too Old
```
Error: Node.js version 16.x.x found, but 18+ required
```
**Solution:**
```bash
# Install Node.js 18+ using Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Issue: npm install Fails
```
Error: EACCES permission denied
```
**Solution:**
```bash
# Fix npm permissions (Linux/Mac)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Or use a Node version manager
```

### Issue: Port 5173 Already in Use
```
Error: Port 5173 is already in use
```
**Solution:**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or start on different port
npm run dev -- --port 3000
```

### Issue: Build Fails with TypeScript Errors
```
Error: Cannot find module 'lucide-react'
```
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## IDE Setup (VS Code Recommended)

### Essential Extensions
1. **ES7+ React/Redux/React-Native snippets**
2. **TypeScript Importer**
3. **Tailwind CSS IntelliSense**
4. **ESLint**
5. **Prettier - Code formatter**
6. **Auto Rename Tag**
7. **Bracket Pair Colorizer 2**

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "typescript": "typescriptreact",
    "javascript": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescriptreact"
  }
}
```

---

## Testing the Setup

### 1. Homepage
- Visit `http://localhost:5173`
- Should see hero section with statistics counters
- Navigation should work between pages

### 2. Navigation Test
- Click all navigation links (Home, Forum, Store, Leaderboard)
- Each page should load without errors
- Mobile menu should work on small screens

### 3. Interactive Features
- Try product detail pages
- Test forum thread views
- Check leaderboard display
- Verify responsive design on different screen sizes

### 4. Modals and Forms
- Test upgrade modal (Premium button)
- Try purchase flow on premium products
- Check form validation and submission

---

## Development Best Practices

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for consistent styling

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create pull request
git push origin feature/new-feature
```

### Code Quality
- Run `npm run lint` before committing
- Use `npm run typecheck` for TypeScript validation
- Write descriptive commit messages
- Keep pull requests focused and small

---

## Troubleshooting

### Development Server Issues
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev

# Check for port conflicts
lsof -i :5173
```

### Build Issues
```bash
# Clean build
npm run build -- --force

# Check for TypeScript errors
npm run typecheck
```

### Dependency Issues
```bash
# Update dependencies
npm update

# Reinstall everything
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps After Setup

### For Frontend Development
1. **Explore the codebase**: Review components and pages
2. **Customize styling**: Modify Tailwind CSS classes
3. **Add new features**: Follow existing patterns
4. **Test responsiveness**: Check on different devices

### For Backend Integration (Future)
1. **Set up Supabase**: Install self-hosted instance
2. **Design database schema**: Plan data structure
3. **Implement API endpoints**: Create backend services
4. **Integrate frontend**: Replace mock data with real APIs

---

## Getting Help

### Documentation Resources
- **[Main README](../README.md)** - Project overview
- **[Development Roadmap](../references/development-roadmap.md)** - Implementation plan
- **[Architecture Overview](../technical/architecture-overview.md)** - Technical details

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check existing guides and FAQs
- **Code Comments**: Review inline documentation

### Development Team
- **Lead Developer**: [Your Name]
- **Project Manager**: [Project Manager Name]
- **Design Team**: [Design Team Contact]

---

**Setup Guide Version**: 1.0.0
**Last Updated**: October 2025
**Compatibility**: Node.js 18+, npm 8+
**Status**: ✅ Production Ready
