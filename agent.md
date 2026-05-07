# Project: Blue Care Static Website

## Overview
This is a static HTML website for a cleaning services company.  
The project contains multiple service pages, a blog page, and reusable assets.

## Tech Stack
- HTML5
- CSS3
- JavaScript (vanilla)
- No framework (pure static site)

## Project Structure
- Root HTML pages:
  - index.html (Homepage)
  - about.html
  - contact.html
  - services.html
  - blog-single.html
  - landing-single.html
  - error.html
  - shortcodes.html

- Service Pages:
  - ac-duct-cleaning.html
  - drain-line-jetting.html
  - kitchen-hood-cleaning.html
  - sump-pit-tank-cleaning.html
  - water-tank-cleaning.html
  - calorifier-tank-cleaning.html

- Other:
  - email-template.html
  - liberty-license-W3Layouts.txt

- Assets:
  - /assets (CSS, JS, images, fonts)

## Conventions
- All pages share a consistent header and footer structure
- Reuse CSS classes from `/assets` instead of creating duplicates
- Maintain consistent spacing, typography, and color scheme
- Keep HTML semantic and clean

## Agent Instructions
- When editing pages:
  - Preserve header and footer consistency across all pages
  - Do not break existing CSS class structure
  - Reuse components (navbar, footer, sections)

- When adding new pages:
  - Follow the structure of `services.html` or `index.html`
  - Ensure navigation links are updated across all pages

- When modifying styles:
  - Update styles inside `/assets` instead of inline CSS
  - Avoid duplication of styles

- When adding scripts:
  - Prefer adding scripts in `/assets/js`
  - Keep JS minimal and optimized

## Common Tasks
- Add new service page → copy an existing service HTML and modify content
- Update navigation → change in all HTML files
- Fix UI bugs → check CSS in `/assets`
- Optimize → reduce duplicate styles and unused assets

## Notes
- This is not a React/Vue project — do not introduce frameworks
- Keep everything lightweight and fast
- SEO-friendly HTML structure is preferred