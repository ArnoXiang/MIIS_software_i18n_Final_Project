import { locale, updateLocale } from '../app.js';

var stringsJSON = {};

const i18n = {

    //load resource json based on locale
    loadStringsJSON: async (newLocale) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`./content/${newLocale}/strings.json`, options)
            stringsJSON = await response.json();
        } catch (err) {
            console.log('Error getting strings', err);
            if (newLocale != "en-US") {
                updateLocale("en-US");
            }
        }
    },

    getString: (view, key) => {
        return stringsJSON[view][key];
    },

    //determine the proper currency format based on locale and return html string
    formatCurrency: (price, color) => {
        let formatted;
        let converted = convertCurrency(price);
        formatted = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyMap[locale] }).format(converted); 
        return `<h4>${formatted}</h4>`


    },
    //return the locale based link to html file within the 'static' folder
    getHTML: () => {
        return `${locale}/terms.html`; //$NON-NLS-L$ 
    },
    //format date accoring to locale
    formatDate: (date) => {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat([locale, 'en-US'], options).format(date); //$NON-NLS-L$
    },
    // Uses Intl.DateTimeFormat which is based on CLDR data
    formatShortDate: (date) => {
        try {
            // Use CLDR-based Intl.DateTimeFormat for locale-specific date formatting
            // This automatically handles different date formats for each locale
            const options = { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            };
            return new Intl.DateTimeFormat(locale, options).format(date);
        } catch (err) {
            console.error('Date formatting error:', err);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
        }
    },
    
    // Generate month options for date input dropdowns
    getMonthOptions: () => {
        const monthOptions = [];
        for (let i = 1; i <= 12; i++) {
            const formattedNumber = ("0" + i).slice(-2);
            const date = new Date(2000, i - 1, 1);
            
            // Use Intl.DateTimeFormat to get locale-appropriate month format
            try {
                const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'numeric' });
                const monthLabel = monthFormatter.format(date);
                monthOptions.push({ value: formattedNumber, label: monthLabel });
            } catch (err) {
                // Fallback to numeric format
                monthOptions.push({ value: formattedNumber, label: formattedNumber });
            }
        }
        return monthOptions;
    },

    // Generate year options for date input dropdowns
    getYearOptions: (yearsAhead = 10) => {
        const currentYear = new Date().getFullYear();
        const yearOptions = [];
        
        for (let i = 0; i <= yearsAhead; i++) {
            const year = currentYear + i;
            const yearShort = year.toString().slice(-2);
            yearOptions.push({ value: yearShort, label: year.toString() });
        }
        return yearOptions;
    },

    // Determine date input order based on locale (returns 'year-month' or 'month-year')
    getDateInputOrder: () => {
        try {
            // Use Intl.DateTimeFormat to detect the locale's preferred date format
            const sampleDate = new Date(2025, 11, 7); // Dec 7, 2025
            const formatter = new Intl.DateTimeFormat(locale, { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
            
            const parts = formatter.formatToParts(sampleDate);
            const yearIndex = parts.findIndex(p => p.type === 'year');
            const monthIndex = parts.findIndex(p => p.type === 'month');
            
            // If year comes before month, it's year-month format (e.g., ja-JP, zh-CN)
            return yearIndex < monthIndex ? 'year-month' : 'month-year';
        } catch (err) {
            // Default to month-year for English
            return 'month-year';
        }
    },

    // Generate expiration date input HTML
    generateExpirationDateInput: function() {
        const monthOptions = this.getMonthOptions();
        const yearOptions = this.getYearOptions(10);
        const order = this.getDateInputOrder();
        
        // Get localized labels with fallback
        const yearLabel = stringsJSON["Checkout"]?.["expDateYearLabel"] || "YY";
        const monthLabel = stringsJSON["Checkout"]?.["expDateMonthLabel"] || "MM";
        
        let html = '';
        
        if (order === 'year-month') {
            // Year first (e.g., Japanese, Chinese)
            html += `
                                    <select id="expDateYear" name="expDateYear" class="checkoutInput">
                                        <option value="" disabled selected hidden>${yearLabel}</option>`;
            yearOptions.forEach(option => {
                html += `<option value="${option.value}">${option.label}</option>`;
            });
            html += `
                                    </select>
                                    <h3>/</h3>
                                    <select id="expDate" name="expDate" class="checkoutInput">
                                        <option value="" disabled selected hidden>${monthLabel}</option>`;
            monthOptions.forEach(option => {
                html += `<option value="${option.value}">${option.label}</option>`;
            });
            html += `
                                    </select>`;
        } else {
            // Month first (e.g., English, Dutch)
            html += `
                                    <select id="expDate" name="expDate" class="checkoutInput">
                                        <option value="" disabled selected hidden>${monthLabel}</option>`;
            monthOptions.forEach(option => {
                html += `<option value="${option.value}">${option.label}</option>`;
            });
            html += `
                                    </select>
                                    <h3>/</h3>
                                    <select id="expDateYear" name="expDateYear" class="checkoutInput">
                                        <option value="" disabled selected hidden>${yearLabel}</option>`;
            yearOptions.forEach(option => {
                html += `<option value="${option.value}">${option.label}</option>`;
            });
            html += `
                                    </select>`;
        }
        
        return html;
    }
}

//used to determine the correct currency symbol
var currencyMap = {
    'en-US': 'USD',
    'zh-CN': 'CNY',
    'nl-NL': 'EUR',
    'ja-JP': 'JPY'
};

//function to perform rough conversion from galactic credits to real currencies
//Disabled for project
var convertCurrency = (price) => {
    return price;
}

export default i18n;