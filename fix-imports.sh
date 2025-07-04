#!/bin/bash

# Fix all relative imports to absolute imports for shared modules
echo "Fixing import statements..."

# Find all TypeScript files and replace relative imports with absolute imports
find src -name "*.ts" -type f -exec sed -i '' 's|from '\''\.\./shared/|from '\''@/shared/|g' {} \;

echo "Import statements fixed!"
echo "Files updated:"
find src -name "*.ts" -type f -exec grep -l "from '@/shared/" {} \; 