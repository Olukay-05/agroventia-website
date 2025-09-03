# Script to initialize Git repository and push to GitHub
# Usage: .\scripts\init-git.ps1

Write-Host "Initializing Git repository..."
git init

Write-Host "Adding all files..."
git add .

Write-Host "Making initial commit..."
git commit -m "Initial commit: AgroVentia homepage with quote request functionality"

Write-Host "Renaming master branch to main..."
git branch -M main

Write-Host "Setting up remote repository..."
$username = Read-Host "Please enter your GitHub username"
$repo = Read-Host "Please enter your repository name"

git remote add origin https://github.com/$username/$repo.git

Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host "Git repository initialized and pushed to GitHub successfully!"