#!/bin/bash

# Script to initialize Git repository and push to GitHub
# Usage: ./scripts/init-git.sh

echo "Initializing Git repository..."
git init

echo "Adding all files..."
git add .

echo "Making initial commit..."
git commit -m "Initial commit: AgroVentia homepage with quote request functionality"

echo "Renaming master branch to main..."
git branch -M main

echo "Setting up remote repository..."
echo "Please enter your GitHub username:"
read username
echo "Please enter your repository name:"
read repo

git remote add origin https://github.com/$username/$repo.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Git repository initialized and pushed to GitHub successfully!"