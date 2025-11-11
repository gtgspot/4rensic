# Forensic Legal Analyzer - Styles Documentation

Professional CSS/SCSS design system for the Victorian Law Compliance Checker.

## Overview

This directory contains a comprehensive, production-ready design system built with SCSS (Sass) that provides:

- **Professional legal application styling** with Victorian-themed color palette
- **Fully responsive design** optimized for desktop, tablet, and mobile
- **Component-based architecture** for maintainable and scalable styles
- **Accessibility features** including focus states and reduced motion support
- **Print-optimized styles** for generating professional reports

## Directory Structure

```
styles/
├── scss/                          # Source SCSS files
│   ├── _variables.scss            # Theme variables (colors, typography, spacing)
│   ├── _mixins.scss               # Reusable SCSS mixins
│   ├── _responsive.scss           # Responsive design & media queries
│   ├── main.scss                  # Main entry point
│   └── components/                # Component-specific styles
│       ├── _index.scss            # Components index
│       ├── _upload-zone.scss      # File upload components
│       ├── _analysis-results.scss # Analysis results display
│       └── _cross-reference.scss  # Cross-reference matrix & timeline
│
├── css/                           # Compiled CSS files
│   ├── forensic-legal-analyzer.css      # Development version (62KB)
│   └── forensic-legal-analyzer.min.css  # Production version (51KB)
│
└── README.md                      # This file
```

## Quick Start

### Using Pre-Compiled CSS

Simply include the compiled CSS in your HTML:

```html
<!-- For development -->
<link rel="stylesheet" href="styles/css/forensic-legal-analyzer.css">

<!-- For production (minified) -->
<link rel="stylesheet" href="styles/css/forensic-legal-analyzer.min.css">
```

### Compiling from SCSS

If you want to modify the styles and recompile:

1. **Install Sass** (if not already installed):
   ```bash
   npm install -g sass
   ```

2. **Compile SCSS to CSS**:
   ```bash
   # Development build (expanded)
   sass styles/scss/main.scss styles/css/forensic-legal-analyzer.css --style=expanded

   # Production build (minified)
   sass styles/scss/main.scss styles/css/forensic-legal-analyzer.min.css --style=compressed
   ```

3. **Watch for changes** (auto-compile):
   ```bash
   sass --watch styles/scss:styles/css
   ```

## Design System

### Color Palette

#### Primary Colors
- **Primary**: `#1a365d` - Deep Navy Blue (Authority, Trust)
- **Secondary**: `#744210` - Legal Brown (Official Documents)
- **Accent Blue**: `#3182ce` - Professional Blue
- **Accent Gold**: `#d69e2e` - Legal Gold

#### Severity Colors (Defect Classification)
- **Critical**: `#c53030` - Red
- **High**: `#dd6b20` - Orange
- **Medium**: `#d69e2e` - Gold/Yellow
- **Low**: `#38a169` - Green

#### Status Colors
- **Success/Compliant**: `#38a169` - Green
- **Warning**: `#d69e2e` - Gold
- **Error/Non-Compliant**: `#c53030` - Red

### Typography

- **Primary Font**: System font stack for optimal performance
  ```
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
  ```
- **Monospace**: `'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace`
- **Legal Text**: `Georgia, 'Times New Roman', serif`

#### Font Sizes
- `xs`: 12px
- `sm`: 14px
- `base`: 16px
- `lg`: 20px
- `xl`: 24px
- `2xl`: 30px
- `3xl`: 36px

### Spacing Scale

Based on 4px increments:
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `6`: 24px
- `8`: 32px
- `12`: 48px

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1280px+

## Component Classes

### Layout

```html
<!-- Container -->
<div class="container">Content</div>
<div class="container container--sm">Narrow content</div>

<!-- Section -->
<div class="section">Full-height section</div>
```

### Cards

```html
<div class="card">
  <div class="card__header">
    <h3>Card Title</h3>
  </div>
  <div class="card__body">
    Card content
  </div>
  <div class="card__footer">
    Card footer
  </div>
</div>

<!-- Variants -->
<div class="card card--primary">Primary card</div>
<div class="card card--success">Success card</div>
<div class="card card--warning">Warning card</div>
<div class="card card--error">Error card</div>
<div class="card card--hoverable">Hoverable card</div>
```

### Buttons

```html
<button class="btn btn--primary">Primary Button</button>
<button class="btn btn--secondary">Secondary Button</button>
<button class="btn btn--outline">Outline Button</button>
<button class="btn btn--ghost">Ghost Button</button>
<button class="btn btn--success">Success Button</button>
<button class="btn btn--danger">Danger Button</button>

<!-- Sizes -->
<button class="btn btn--primary btn--sm">Small</button>
<button class="btn btn--primary">Default</button>
<button class="btn btn--primary btn--lg">Large</button>

<!-- Block -->
<button class="btn btn--primary btn--block">Full Width</button>
```

### Badges

```html
<span class="badge badge--critical">Critical</span>
<span class="badge badge--high">High</span>
<span class="badge badge--medium">Medium</span>
<span class="badge badge--low">Low</span>
<span class="badge badge--success">Success</span>
<span class="badge badge--info">Info</span>
<span class="badge badge--compliant">Compliant</span>
<span class="badge badge--non-compliant">Non-Compliant</span>
```

### Alerts

```html
<div class="alert alert--success">
  <span class="alert__icon">✅</span>
  <div class="alert__content">
    <div class="alert__title">Success</div>
    <div class="alert__message">Operation completed successfully.</div>
  </div>
</div>

<!-- Variants: --success, --warning, --error, --info -->
```

### Forms

```html
<div class="form-group">
  <label class="form-group__label">Label</label>
  <input type="text" class="form-group__input" placeholder="Enter text">
  <span class="form-group__help">Helper text</span>
</div>

<!-- Textarea -->
<div class="form-group">
  <label class="form-group__label">Message</label>
  <textarea class="form-group__textarea"></textarea>
</div>

<!-- Select -->
<div class="form-group">
  <label class="form-group__label">Select</label>
  <select class="form-group__select">
    <option>Option 1</option>
  </select>
</div>

<!-- Error state -->
<div class="form-group form-group--error">
  <input class="form-group__input">
  <span class="form-group__error">Error message</span>
</div>
```

### Upload Zone

```html
<div class="upload-zone">
  <span class="upload-zone__icon">📄</span>
  <h3 class="upload-zone__title">Upload Document</h3>
  <p class="upload-zone__description">Drag and drop or click to browse</p>
  <button class="upload-zone__button">Choose File</button>
  <input type="file" class="upload-zone__input">
  <p class="upload-zone__supported-formats">Supported: .txt, .doc, .docx, .pdf</p>
</div>

<!-- Active/Dragover states -->
<div class="upload-zone upload-zone--active">...</div>
<div class="upload-zone upload-zone--dragover">...</div>
```

### Phase Sections (Analysis Results)

```html
<div class="phase-section phase-section--phase-a">
  <div class="phase-section__header">
    <div class="phase-section__header-content">
      <div class="phase-section__header-title">
        <h3>
          <span class="phase-section__icon">🔍</span>
          Phase A: Forensic Examination
        </h3>
        <p>Word-by-word linguistic inspection</p>
      </div>
      <span class="phase-section__header-toggle">▼</span>
    </div>
  </div>
  <div class="phase-section__body">
    Phase content
  </div>
</div>

<!-- Phase variants: --phase-a, --phase-b, --phase-c -->
```

### Timeline

```html
<div class="timeline">
  <div class="timeline__line"></div>
  <div class="timeline__item">
    <div class="timeline__marker"></div>
    <div class="timeline__content">
      <div class="timeline__date">2024-11-11</div>
      <div class="timeline__title">Event Title</div>
      <div class="timeline__description">Event description</div>
    </div>
  </div>
</div>
```

### Cross-Reference Matrix

```html
<div class="cross-reference-matrix">
  <div class="cross-reference-matrix__header">
    <h3>Cross-Reference Matrix</h3>
  </div>
  <div class="cross-reference-matrix__body">
    <div class="cross-reference-matrix__grid">
      <!-- Categories and items -->
    </div>
  </div>
</div>
```

## Utility Classes

### Display
- `.d-none` - Display none
- `.d-block` - Display block
- `.d-flex` - Display flex
- `.d-inline-flex` - Display inline-flex

### Flexbox
- `.flex-row` - Flex direction row
- `.flex-column` - Flex direction column
- `.align-center` - Align items center
- `.justify-center` - Justify content center
- `.justify-between` - Justify content space-between
- `.gap-2`, `.gap-3`, `.gap-4` - Gap spacing

### Text
- `.text-center` - Text align center
- `.text-left` - Text align left
- `.text-right` - Text align right
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.font-bold` - Font weight bold
- `.font-semibold` - Font weight semibold

### Spacing
- `.m-0` - Margin 0
- `.mt-2`, `.mt-4`, `.mt-6` - Margin top
- `.mb-2`, `.mb-4`, `.mb-6` - Margin bottom
- `.p-2`, `.p-4`, `.p-6` - Padding

### Borders
- `.rounded` - Border radius medium
- `.rounded-lg` - Border radius large
- `.border-top` - Border top
- `.border-bottom` - Border bottom

## Customization

### Modifying Variables

Edit `styles/scss/_variables.scss` to customize:

```scss
// Change primary color
$color-primary: #1a365d;  // Change to your color

// Change font family
$font-primary: -apple-system, ...;  // Change to your font

// Change spacing
$spacing-4: 1rem;  // Adjust spacing scale
```

### Creating Custom Components

1. Create a new file in `styles/scss/components/`
2. Import it in `styles/scss/components/_index.scss`
3. Recompile the SCSS

Example:
```scss
// styles/scss/components/_my-component.scss
.my-component {
  background-color: $color-primary;
  padding: $spacing-4;
  border-radius: $border-radius-md;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- Focus states for keyboard navigation
- Reduced motion support (`prefers-reduced-motion`)
- Semantic color usage with sufficient contrast
- Screen reader support with visually hidden utilities

## Print Styles

Optimized print styles are included for generating professional reports:
- Hides non-essential UI elements (buttons, upload zones)
- Adjusts colors for better print quality
- Prevents page breaks within important content
- Shows URLs for links

## Performance

- **Development CSS**: 62KB (expanded, readable)
- **Production CSS**: 51KB (minified, optimized)
- Uses system fonts for zero external dependencies
- Minimal use of shadows and effects for fast rendering

## Future Enhancements

Potential additions (not yet implemented):
- Dark mode support
- Additional document type colors
- Animation library
- More component variants

## Contributing

When adding new styles:
1. Follow the existing naming conventions (BEM methodology)
2. Use variables from `_variables.scss` instead of hard-coded values
3. Ensure responsive behavior is tested
4. Document new components in this README
5. Recompile CSS after changes

## License

Part of the Forensic Legal Analyzer project.
All rights reserved.

---

**Version**: 1.0.0
**Last Updated**: November 2024
**Maintainer**: Forensic Legal Analyzer Team
