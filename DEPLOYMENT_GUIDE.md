# Email Performance Dashboard - Deployment Guide

## 📋 Overview
This guide provides step-by-step instructions to deploy your Email Performance Dashboard to **Netlify** or **GitHub Pages** and embed it in a Pardot landing page.

---

## 🚀 Option 1: Deploy to Netlify

### Prerequisites
- A Netlify account (sign up free at [netlify.com](https://netlify.com))
- Your project connected to GitHub (recommended) or manual upload

### Method A: Deploy via GitHub (Recommended)

1. **Connect Your Project to GitHub**
   - In Lovable, click the GitHub button in the top right
   - Connect your GitHub account if not already connected
   - Click "Create Repository" to push your code to GitHub

2. **Deploy to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select "GitHub" and authorize Netlify
   - Choose your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click "Deploy site"

3. **Configure Custom Domain (Optional)**
   - After deployment, go to Site Settings → Domain Management
   - Click "Add custom domain" and follow instructions

### Method B: Manual Deployment

1. **Build Your Project Locally**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `dist` folder onto the Netlify dashboard
   - Your site will be deployed instantly

---

## 🚀 Option 2: Deploy to GitHub Pages

### Prerequisites
- A GitHub account
- Project pushed to a GitHub repository

### Steps

1. **Connect to GitHub via Lovable**
   - Click GitHub button in top right of Lovable
   - Create repository and push your code

2. **Install gh-pages Package**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update package.json**
   Add these scripts and set the homepage:
   ```json
   {
     "homepage": "https://yourusername.github.io/repository-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Update vite.config.ts**
   Add base path configuration:
   ```typescript
   export default defineConfig(({ mode }) => ({
     base: '/repository-name/',
     // ... rest of config
   }))
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "gh-pages" branch
   - Click Save
   - Your site will be available at `https://yourusername.github.io/repository-name`

---

## 📦 Embedding in Pardot Landing Page

### Step 1: Get Your Deployed URL
- **Netlify:** Copy the URL from your site dashboard (e.g., `https://your-app.netlify.app`)
- **GitHub Pages:** Use `https://yourusername.github.io/repository-name`

### Step 2: Create Iframe Code

```html
<iframe 
  src="https://your-deployed-url.com" 
  width="100%" 
  height="1200px" 
  frameborder="0" 
  scrolling="auto"
  style="border: none; min-height: 1200px;"
  title="Email Performance Dashboard">
</iframe>
```

### Step 3: Add to Pardot Landing Page

1. **Edit Your Pardot Landing Page**
   - Log in to Pardot
   - Navigate to Marketing → Landing Pages
   - Select your landing page or create a new one

2. **Insert HTML**
   - Switch to HTML editor mode
   - Paste the iframe code where you want the dashboard to appear

3. **Adjust Height as Needed**
   - You may need to adjust the `height` attribute based on your content
   - Recommended: Start with `1200px` and adjust based on actual content

### Step 4: Responsive Considerations

For better mobile responsiveness in Pardot, use this enhanced iframe code:

```html
<div style="position: relative; width: 100%; padding-bottom: 75%; overflow: hidden;">
  <iframe 
    src="https://your-deployed-url.com" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    frameborder="0" 
    scrolling="auto"
    title="Email Performance Dashboard">
  </iframe>
</div>
```

---

## 🔧 Troubleshooting

### Dashboard Not Loading in Iframe

**Issue:** Blank screen in iframe  
**Solution:** Check if CORS or X-Frame-Options are blocking the embed. Add to your `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self' https://go.pardot.com https://*.pardot.com;">
```

### Charts Not Displaying

**Issue:** Plotly charts not showing  
**Solution:** Ensure the iframe has sufficient height and width. Charts need space to render.

### File Upload Not Working

**Issue:** File upload button not responding  
**Solution:** This is a client-side app - file uploads work within the iframe. Ensure users have proper file permissions.

---

## 📊 Features Checklist

✅ **File Upload:** CSV, Excel (.xls, .xlsx, .xlsm), JSON support  
✅ **Filters:** Month, Business Unit, Nurture Name, Nurture Type  
✅ **KPIs:** Total Sent, Delivered, Bounces, Bounce Rate  
✅ **Charts:** 
  - Monthly Opens & Clicks (Bar)
  - Delivery vs Bounces (Pie)
  - Engagement Metrics (Bar)
  - Email Funnel (Funnel)  
✅ **Responsive Design:** Works on desktop, tablet, and mobile  
✅ **Excel Date Conversion:** Automatically converts Excel serials to readable dates

---

## 🎨 Customization Tips

### Change Colors
Edit `src/index.css` to modify the color scheme:
```css
--primary: 221 83% 53%;  /* Main blue */
--accent: 262 83% 58%;   /* Purple accent */
```

### Adjust Layout
Edit `src/components/Dashboard.tsx` to modify spacing and layout

### Add More Charts
Extend `src/components/ChartsGrid.tsx` with additional Plotly visualizations

---

## 📞 Support

For issues or questions:
- Check the [Lovable Documentation](https://docs.lovable.dev)
- Review [Plotly.js Documentation](https://plotly.com/javascript/)
- Netlify Support: [docs.netlify.com](https://docs.netlify.com)
- GitHub Pages: [docs.github.com/pages](https://docs.github.com/pages)

---

## 🎉 You're All Set!

Your Email Performance Dashboard is now ready to be deployed and embedded in Pardot. Upload your data files and start analyzing your email campaigns!
