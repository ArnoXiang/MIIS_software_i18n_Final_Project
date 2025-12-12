# Star Wars Droid Shop - Localization Project

## Project Overview

This is a final project submission for **TRLM8620: Software Localization & Internationalization** at the Middlebury Institute of International Studies. The project demonstrates practical implementation of i18n/l10n principles in a web-based e-commerce application.

## About the Project

**Star Wars Droid Shop** is a multilingual shopping website featuring a catalog of Star Wars droids. The application implements comprehensive internationalization and localization to support multiple languages and regions, including:

- 🇺🇸 **English (en-US)**
- 🇯🇵 **Japanese (ja-JP)**
- 🇳🇱 **Dutch (nl-NL)**

## Key Features

### Internationalization (i18n)
- **Dynamic Language Switching**: Users can seamlessly switch between supported languages
- **Centralized String Management**: All localizable content stored in JSON resource files
- **Locale-Aware Formatting**: 
  - Currency formatting based on locale and regional preferences
  - Date/time formatting according to CLDR standards
  - Number formatting with proper decimal and thousands separators

### Localization (l10n)
- **Translated Content**: Product titles, descriptions, and UI strings localized for each language
- **Regional HTML Pages**: Locale-specific terms and conditions pages
- **Product Information**: Customized product catalog with localized metadata

### Technical Implementation
- **RESTful Architecture**: Dynamic content loading via fetch API
- **Component-Based UI**: Modular React-style components (Navbar, Cart, Bottombar, etc.)
- **Service Layer**: Dedicated i18n service for centralized locale management
- **Build Tools**: Babel, Rollup, SCSS compilation for production-ready assets

## Project Structure

```
├── src/
│   ├── app.js                    # Main application entry point
│   ├── index.html                # Root HTML template
│   ├── content/                  # Localizable content
│   │   ├── products.js           # Product catalog
│   │   ├── en-US/
│   │   │   └── strings.json      # English strings
│   │   ├── ja-JP/
│   │   │   └── strings.json      # Japanese strings
│   │   └── nl-NL/
│   │       └── strings.json      # Dutch strings
│   ├── services/
│   │   ├── i18n.js               # Localization service module
│   │   └── Utils.js              # Utility functions
│   ├── views/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   └── classes/
│   │       └── Order.js          # Order model
│   ├── css/                      # Stylesheets (CSS & SCSS)
│   ├── img/                      # Images and assets
│   ├── plugins/                  # Third-party libraries
│   └── static/                   # Static HTML content
│       ├── en-US/
│       │   └── terms.html        # English terms page
│       ├── ja-JP/
│       │   └── terms.html        # Japanese terms page
│       └── nl-NL/
│           └── terms.html        # Dutch terms page
├── package.json                  # Project dependencies
├── build.xml                     # Build configuration
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v12 or higher)
- npm (v6 or higher)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArnoXiang/MIIS_software_i18n_Final_Project.git
   cd MIIS_software_i18n_Final_Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run server
   ```
   The application will be available at `http://localhost:8080` (or the next available port)

## Usage

### Switching Languages
Use the language selector in the navbar to switch between English, Japanese, and Dutch. The application will:
1. Load the appropriate localized strings
2. Update all UI elements
3. Adjust currency and date formatting
4. Fetch locale-specific static content (e.g., terms & conditions)

### Shopping Features
- **Browse Products**: View the droid catalog with localized product information
- **Add to Cart**: Customize quantities and review cart
- **Checkout**: Complete purchase with locale-specific formatting
- **Order History**: Track previous orders

## Localization Implementation Details

### String Resources
All translatable strings are stored in JSON format:

```json
{
  "title": {
    "1": "C-3PO Protocol Droid",
    "2": "DUM-Series Astromech"
  },
  "desc": {
    "1": "A protocol droid fluent in six million forms of communication..."
  }
}
```

### i18n Service API
The `i18n` module provides:
- `loadStringsJSON(locale)` - Load strings for a specific locale
- `getString(view, key)` - Retrieve a localized string
- `formatCurrency(price, color)` - Format currency for the current locale
- `formatDate(date)` - Format dates according to locale preferences
- `getHTML()` - Get locale-specific HTML file path

### Currency Conversion
The application implements locale-aware currency formatting with conversion rates for different regions (USD, JPY, EUR).

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Build Tools**: Babel, Rollup, webpack
- **Styling**: SCSS/CSS
- **Localization**: JavaScript Intl API, custom i18n service
- **Development Server**: live-server
- **Package Manager**: npm

## Learning Outcomes

Through this project, key localization concepts were applied:

✓ Understanding of i18n/l10n best practices and standards  
✓ Implementation of dynamic language switching  
✓ Proper handling of cultural conventions (dates, currencies, numbers)  
✓ Resource management for multiple languages  
✓ User experience optimization for international audiences  
✓ Version control and deployment practices  

## Deployment

To build for production:
```bash
npm run build
```

This will:
- Compile SCSS to CSS
- Bundle JavaScript with Rollup
- Transpile code with Babel for browser compatibility

## Author

Yizhuo (Arno) Xiang  
MIIS - Middlebury Institute of International Studies  
Software Localization & Internationalization (TRLM8620)

## License

ISC

## Notes

- This project was developed as a coursework assignment
- All translated content follows the original English copy's intent and tone
- The project emphasizes practical i18n/l10n implementation over design complexity
