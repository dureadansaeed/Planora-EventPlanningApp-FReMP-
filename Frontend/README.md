# Planora - Event Planning Platform Frontend

> **Updated April 2026**: Comprehensive design system redesign with modern, professional UI

## 🎨 What's New

Your Planora frontend has been completely redesigned with:
- **Modern Design System** with 50+ CSS variables
- **Soft Pink Theme** - professional and elegant
- **Professional Components** - Navigation bar, footer, hero sections
- **Smooth Animations** - subtle, performant interactions
- **Fully Responsive** - works perfectly on all devices
- **Poppins Typography** - clean, modern font system

### Quick Start

1. **Read the guides** (in order):
   - [`REDESIGN_SUMMARY.md`](./REDESIGN_SUMMARY.md) - Overview of new features
   - [`DESIGN_SYSTEM_GUIDE.md`](./DESIGN_SYSTEM_GUIDE.md) - Complete design system reference
   - [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md) - How to add components to pages
   - [`IMPLEMENTATION_CHECKLIST.md`](./IMPLEMENTATION_CHECKLIST.md) - QA checklist

2. **Key Documentation Files**:
   - `DESIGN_SYSTEM_GUIDE.md` - Colors, typography, spacing, animations
   - `INTEGRATION_GUIDE.md` - Before/after code examples
   - `IMPLEMENTATION_CHECKLIST.md` - Testing and deployment checklist

3. **Key Component Files**:
   - `src/components/UserComponents/NavigationBar.jsx` - Modern navbar
   - `src/components/UserComponents/ModernFooter.jsx` - Professional footer
   - `src/styles/design-tokens.css` - Design system variables

## 📁 Project Structure

```
Frontend/
├── public/
│   └── planora-logo.svg           # Logo (add your logo here)
├── src/
│   ├── styles/
│   │   ├── design-tokens.css      # Design system variables ⭐
│   │   ├── index.css              # Global styles
│   │   ├── Cards.css              # Card component styling
│   │   ├── Sections.css           # Section/hero layouts
│   │   ├── Forms.css              # Modern form styling
│   │   ├── NavigationBar.css      # Navbar styling
│   │   ├── Footer.css             # Footer styling
│   │   ├── UserStyles.css         # User page styles
│   │   └── Admin.css              # Admin page styles
│   ├── components/
│   │   ├── UserComponents/
│   │   │   ├── NavigationBar.jsx  # Modern sticky navbar ⭐
│   │   │   ├── ModernFooter.jsx   # Professional footer ⭐
│   │   │   └── UserHeroSectionModern.jsx # Hero section ⭐
│   │   ├── LoginComponents/
│   │   │   ├── LoginForm.jsx      # Updated with design tokens ⭐
│   │   │   ├── FormInput.jsx      # Modern form input ⭐
│   │   │   └── PasswordInput.jsx  # Modern password input ⭐
│   │   └── ...other components
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── DESIGN_SYSTEM_GUIDE.md         # Complete reference
├── REDESIGN_SUMMARY.md            # Feature overview
├── INTEGRATION_GUIDE.md           # Step-by-step integration
└── IMPLEMENTATION_CHECKLIST.md    # QA checklist

⭐ = Recently updated/created
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## 🎨 Design System

### Colors
- **Primary**: #FFB6C1 (Soft Light Pink)
- **Primary Dark**: #E8B4D5 (Hover/Active)
- **Text Primary**: #4A4A4A (Dark Gray)
- **Background**: Linear gradient with light pinks

See `design-tokens.css` for complete color palette.

### Typography
- **Body**: Poppins (imported from Google Fonts)
- **Headings**: Abril Fatface (elegant, script-like)

### Components
- **NavigationBar** - Sticky navigation with logo and CTA
- **ModernFooter** - Multi-column footer with links
- **Cards** - Modern design with shadows and hover effects
- **Forms** - Clean inputs with focus/error states
- **Hero Sections** - Eye-catching banners with CTAs

## 📱 Responsive Design

All components are fully responsive:
- **Mobile** (< 480px) - Optimized for small screens
- **Tablet** (480-1024px) - Adapts layout intelligently  
- **Desktop** (1024px+) - Uses full width gracefully

## 🛠️ Recent Updates

✅ Design tokens system created  
✅ Navigation bar component (sticky, modern)  
✅ Professional footer (multi-column)  
✅ Hero section component  
✅ Card styling system  
✅ Form styling modernized  
✅ Global styles updated with Poppins font  
✅ Responsive design for all breakpoints  
✅ Soft pink theme implemented throughout  
✅ Smooth animations and transitions  

## 📚 Documentation

### For Design System Reference
👉 See [`DESIGN_SYSTEM_GUIDE.md`](./DESIGN_SYSTEM_GUIDE.md)

### For Integration Instructions
👉 See [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)

### For Testing Checklist
👉 See [`IMPLEMENTATION_CHECKLIST.md`](./IMPLEMENTATION_CHECKLIST.md)

## 🔧 Setup Logo

1. Prepare your Planora logo (PNG or SVG)
2. Save to `/public/planora-logo.svg`
3. That's it! It's automatically used in navbar and footer

A placeholder SVG logo is included for testing.

## 💡 Usage Examples

### Add Navigation Bar to a Page
```jsx
import NavigationBar from './UserComponents/NavigationBar';

export default function MyPage() {
  return (
    <>
      <NavigationBar />
      <main>{/* Your content */}</main>
    </>
  );
}
```

### Add Footer to a Page
```jsx
import ModernFooter from './UserComponents/ModernFooter';

export default function MyPage() {
  return (
    <>
      {/* Your content */}
      <ModernFooter />
    </>
  );
}
```

### Use CSS Variables in Styles
```jsx
<div style={{
  color: "var(--color-text-primary)",
  padding: "var(--spacing-lg)",
  fontSize: "var(--font-size-base)"
}}>
  Content
</div>
```

## 🎯 Next Steps

1. ✅ Review [`DESIGN_SYSTEM_GUIDE.md`](./DESIGN_SYSTEM_GUIDE.md)
2. ✅ Read [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)
3. 📝 Integrate components into existing pages (see guide)
4. 🧪 Test on all devices (see checklist)
5. 🚀 Deploy to production

## 🐛 Troubleshooting

**Issue**: Logo not showing
- **Solution**: Ensure `planora-logo.svg` is in `/public/` folder

**Issue**: Fonts not loading
- **Solution**: Check Google Fonts imports in `design-tokens.css`

**Issue**: Styles not applying
- **Solution**: Verify CSS files are imported in `index.css`

**Issue**: Colors don't match design
- **Solution**: Check color values in `design-tokens.css`

## 🆘 Need Help?

1. Check [`DESIGN_SYSTEM_GUIDE.md`](./DESIGN_SYSTEM_GUIDE.md) for complete reference
2. Review component JSX files for usage examples
3. Check component CSS files for styling details
4. See [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md) for before/after examples

---

# React + Vite (Original Setup Info Below)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
