# Copilot Instructions for Hugo Blog

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Hugo static blog project using the PaperMod theme. The blog is configured for Chinese content with modern features.

## Development Guidelines

- Use Chinese for content creation and UI text
- Follow Hugo best practices for content organization
- Use front matter with appropriate tags and categories
- Ensure all content has proper metadata (title, date, summary, tags)
- Use semantic HTML and accessible markup
- Optimize images and assets for web performance

## File Structure

- `content/posts/` - Blog articles
- `content/` - Other pages (about, etc.)
- `static/` - Static assets (images, files)
- `themes/PaperMod/` - Theme files (do not modify directly)
- `hugo.toml` - Main configuration file

## Content Guidelines

- Set `draft: false` for published content
- Use meaningful slugs in URLs
- Include summary for better SEO
- Use appropriate tags and categories
- Follow consistent date formatting

## Theme Customization

- Use PaperMod theme parameters in hugo.toml
- Create custom layouts in `layouts/` if needed
- Add custom CSS in `assets/css/`
- Use Hugo's built-in functions and features

## Deployment

This blog is configured for deployment to:
- GitHub Pages
- Netlify
- Vercel

All platforms support automatic deployment from Git repositories.
