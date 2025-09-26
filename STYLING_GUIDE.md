# Showtime Application Styling Guide

## Overview
This guide outlines the consistent styling patterns used throughout the Showtime application to ensure visual coherence and maintainability.

## Color Palette

### CSS Custom Properties (Variables)
All colors are defined in `/fullstack/app/assets/base.css`:

```css
--sht-white-mute: #f2f2f2;
--sht-lightpink: #FFCED6;
--sht-pink: #F4798D;
--sht-pinkhighlight: #f4798ede;
--sht-pinkhighlight2: #f4798eb5;
--sht-black: #181818;
--sht-indigo: #2c3e50;
--sht-text: #410000;
```

### Usage
- **Primary Background**: `var(--sht-lightpink)` - Light pink for page backgrounds
- **Primary Accent**: `var(--sht-pink)` - Main pink for buttons, borders, highlights
- **Text Color**: `var(--color-text)` or `var(--sht-text)` - Dark red/brown for text
- **Interactive States**: 
  - Hover: `var(--sht-pinkhighlight)`
  - Active: `var(--sht-pinkhighlight2)`

## Typography

### Font Family
- **Primary Font**: "Nunito Sans", sans-serif
- **Base Font Size**: 18px
- **Line Height**: 1.6

### Headings
```css
h2 {
  font-weight: bold;
  font-size: 1.25rem;
}
```

## Button Styling

### Standard Button Class
**CRITICAL**: All buttons must use the `.button` class for consistency.

```css
button.button {
  width: 8rem;
  height: 2rem;
  background-color: var(--sht-pink);
  color: white;
  font: inherit;
  font-weight: bold;
  border: 1px solid var(--color-text);
  border-radius: 10px;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 8px;
}
```

### Button States
```css
button:hover {
  background-color: var(--sht-pinkhighlight);
}

button:active {
  background-color: var(--sht-pinkhighlight2);
}
```

### Button Usage Examples
```vue
<!-- Standard submit button -->
<UButton type="submit" class="button">Submit</UButton>

<!-- Action button -->
<UButton class="button" @click="handleAction">Action</UButton>

<!-- HTML button -->
<button class="button">Click Me</button>
```

## Form Input Styling

### Standard Input
```css
input {
  padding: 0.5rem;
  border: 1px solid var(--sht-pink);
  border-radius: 10px;
  margin-top: 0;
  margin-bottom: 1rem;
}
```

### Form Layout
- Use `UForm` with `class="flex flex-col gap-4"` for consistent spacing
- Use `UFormField` for proper label and input grouping

```vue
<UForm class="flex flex-col gap-4" @submit="handleSubmit">
  <UFormField label="Field Name" name="fieldName">
    <UInput v-model="value" placeholder="Placeholder text" />
  </UFormField>
  <UButton type="submit" class="button">Submit</UButton>
</UForm>
```

## Container/Card Styling

### Standard Container Pattern
Used for dashboard cards and sections:

```css
main > div {
  width: 30rem;
  padding: 0.2rem 0.5rem;
  margin: 0.5rem;
  border: 1px solid var(--sht-text);
  border-radius: 10px;
  height: fit-content;
}
```

### Layout Classes
```css
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}
```

## Border Radius Standards
- **Standard Radius**: 10px for buttons, inputs, containers
- **Small Radius**: 8px for smaller elements
- **Circular**: 50% for icon buttons

## Spacing Guidelines

### Margins
- **Button Margins**: `margin-left: 8px; margin-right: 8px;`
- **Container Margins**: `margin: 0.5rem;`
- **Section Margins**: `margin-top: 1rem;`

### Padding
- **Input Padding**: `padding: 0.5rem;`
- **Container Padding**: `padding: 0.2rem 0.5rem;`
- **Button Internal**: Handled by width/height, not padding

### Gaps
- **Form Element Gap**: `gap: 4` (Tailwind class) or `gap-4`
- **Flex Container Gap**: `gap: 1rem`

## File Upload Styling Pattern

### Custom File Input Styling
For file uploads, hide the default input and create a custom button:

```vue
<div class="file-upload-container">
  <input 
    ref="fileInput"
    type="file" 
    multiple 
    @change="handleFileUpload"
    class="file-input"
    id="file-upload"
  />
  <label for="file-upload" class="file-upload-button">
    <Icon name="i-heroicons-document-arrow-up" class="mr-2" />
    Button Text
  </label>
</div>
```

```css
.file-upload-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-upload-button {
  /* Use exact same styling as button.button */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 2rem;
  background-color: var(--sht-pink);
  color: white;
  font: inherit;
  font-weight: bold;
  border: 1px solid var(--color-text);
  border-radius: 10px;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 8px;
}
```

## Component Structure Patterns

### Modal Pattern
```vue
<UModal title="Modal Title" size="sm">
  <button class="button">Trigger Button</button>
  <template #body>
    <UForm class="flex flex-col gap-4" @submit="handleSubmit">
      <!-- Form fields -->
      <UButton type="submit" class="button">Submit</UButton>
    </UForm>
  </template>
</UModal>
```

### Dashboard Card Pattern
```vue
<main class="flex flex-wrap justify-center items-center mt-4">
  <div>
    <h2>Card Title</h2>
    <!-- Card content -->
  </div>
</main>

<style scoped>
main > div {
  width: 30rem;
  padding: 0.2rem 0.5rem;
  margin: 0.5rem;
  border: 1px solid var(--sht-text);
  border-radius: 10px;
  height: fit-content;
}
</style>
```

## Icon Usage

### Standard Icons
- Use Heroicons via `<Icon name="i-heroicons-[icon-name]" />`
- Common icons:
  - Document: `i-heroicons-document`
  - Upload: `i-heroicons-document-arrow-up`
  - Close/Remove: `i-heroicons-x-mark`

### Icon Styling
```css
.icon {
  color: var(--sht-pink);
  width: 1.25rem;
  height: 1.25rem;
}
```

## Interactive Element States

### Hover Effects
```css
element:hover {
  background-color: var(--sht-pinkhighlight);
  /* Optional transform for small elements */
  transform: scale(1.1);
}
```

### Active/Pressed States
```css
element:active {
  background-color: var(--sht-pinkhighlight2);
  transform: scale(0.95);
}
```

## Responsive Design

### Main Layout
```css
@media (min-width: 1024px) {
  #app {
    display: block;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}
```

## Best Practices

### DO's
- ✅ Always use `class="button"` for buttons
- ✅ Use CSS custom properties for colors
- ✅ Maintain consistent border-radius (10px)
- ✅ Use the standard container pattern for cards
- ✅ Follow the form layout patterns with UForm/UFormField
- ✅ Use consistent margins (8px for buttons, 0.5rem for containers)

### DON'Ts
- ❌ Don't create custom button styles without inheriting from `.button`
- ❌ Don't use hardcoded colors instead of CSS variables
- ❌ Don't mix different border-radius values
- ❌ Don't create buttons with different dimensions than 8rem × 2rem
- ❌ Don't use different font families

### File-Specific Notes
- **Main CSS**: `/fullstack/app/assets/main.css` - Core button and element styling
- **Base CSS**: `/fullstack/app/assets/base.css` - Color variables and typography
- **Component CSS**: Use `<style scoped>` for component-specific styles
- **Global Classes**: App-wide classes should be in main.css

### Framework Integration
- **Nuxt UI**: Use UButton, UForm, UFormField, UInput, etc. with `class="button"` override
- **Tailwind**: Utility classes for layout (flex, gap-4, etc.)
- **Icons**: Heroicons via Nuxt Icon module

This guide ensures all future components maintain visual consistency with the existing pink-themed design system.