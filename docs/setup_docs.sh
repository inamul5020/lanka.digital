#!/bin/bash

# 📚 Documentation Setup Script
# This script sets up the documentation structure in your project
# Run this script from your project root to initialize documentation

echo "📚 Setting up documentation structure..."
echo "========================================"

# Check if docs directory already exists
if [ -d "docs" ]; then
    echo "⚠️  docs directory already exists!"
    read -p "Do you want to backup existing docs and continue? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "💾 Creating backup of existing docs..."
        cp -r docs docs_backup_$(date +%Y%m%d_%H%M%S)
        echo "✅ Backup created"
    else
        echo "❌ Setup cancelled"
        exit 1
    fi
else
    echo "📁 Creating docs directory..."
    mkdir -p docs
    echo "✅ docs directory created"
fi

# Find the template directory
TEMPLATE_DIR=""
if [ -d "docs_template" ]; then
    TEMPLATE_DIR="docs_template"
elif [ -d "documentation_template_system/docs_template" ]; then
    TEMPLATE_DIR="documentation_template_system/docs_template"
elif [ -d "../docs_template" ]; then
    TEMPLATE_DIR="../docs_template"
else
    echo "❌ Error: Could not find docs_template directory"
    echo "📁 Please ensure you're running this script from the correct location"
    echo "📁 The script should be run from a directory containing docs_template/"
    exit 1
fi

# Copy template to docs directory
echo "📁 Copying documentation template from $TEMPLATE_DIR..."
cp -r $TEMPLATE_DIR/* docs/
echo "✅ Documentation structure created"

# Make scripts executable
chmod +x docs/templates/git/customize_template.sh 2>/dev/null || true
chmod +x docs/scripts/*.sh 2>/dev/null || true

echo ""
echo "✅ Documentation setup complete!"
echo ""
echo "📁 Created documentation structure in docs/"
echo ""
echo "🎯 Next steps:"
echo "1. Customize docs/README.md with your project details"
echo "2. Update placeholder values in documentation files"
echo "3. Add your project-specific content"
echo "4. Run docs/templates/git/customize_template.sh if using project templates"
echo ""
echo "📚 Your documentation is ready to use!"
