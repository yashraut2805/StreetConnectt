# StreetConnect - Empowering Indian Street Food Vendors

StreetConnect is a comprehensive full-stack web application designed to empower Indian street food vendors by providing them with digital tools for sourcing raw materials, managing inventory, and growing their businesses.

## 🌟 Features

### 🛒 Marketplace
- **Product Browsing**: Browse through a curated selection of raw materials and utensils
- **Advanced Filtering**: Filter by category, price range, rating, and delivery options
- **Geo-based Discovery**: Find nearby suppliers using PIN code or GPS location
- **UPI Payment Integration**: Secure payment processing with Razorpay
- **Shopping Cart**: Add items and manage quantities
- **Review System**: Rate and review suppliers for credibility

### 📊 Inventory Management
- **Stock Tracking**: Monitor stock levels in real-time
- **Low Stock Alerts**: Automated notifications when items run low
- **Smart Dashboard**: Visual overview of inventory status
- **Stock Charts**: Track stock level trends over time
- **Import/Export**: CSV import/export functionality
- **CRUD Operations**: Add, edit, delete, and update stock levels

### 🌐 Community Forum
- **Peer Support**: Connect with fellow vendors
- **Expert Advice**: Get guidance from food authority representatives
- **Best Practices**: Share tips and techniques
- **Discussion Categories**: Organized topics for easy navigation

### 📈 Analytics Dashboard
- **Spending Insights**: Track monthly expenses and savings
- **Purchase History**: Detailed order tracking
- **Performance Metrics**: Business analytics and trends
- **Visual Reports**: Charts and graphs for data visualization

### 🌍 Multilingual Support
- **Multiple Languages**: English, Hindi, Marathi, Tamil, Telugu
- **Voice Input**: Speech-to-text functionality for accessibility
- **Cultural Context**: Region-specific features and content

### 🤖 AI Assistant
- **Smart Recommendations**: Cost-effective product combinations
- **Purchase Optimization**: AI-powered ordering suggestions
- **Combo Deals**: Intelligent bundling for better prices

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Interactive functionality and dynamic content
- **Chart.js**: Data visualization and analytics
- **Font Awesome**: Icon library

### Backend Options
- **PHP**: Minimal server-side processing
- **Firebase**: Alternative backend with real-time database
- **MySQL**: Traditional database option

### Payment Integration
- **Razorpay**: UPI, cards, net banking, and wallet payments
- **Secure Gateway**: PCI DSS compliant payment processing

### Additional Libraries
- **Web Speech API**: Voice input functionality
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
StreetConnect/
├── index.html                 # Main homepage
├── pages/                     # Application pages
│   ├── marketplace.html       # Product marketplace
│   ├── inventory.html         # Inventory dashboard
│   ├── forum.html            # Community forum
│   ├── analytics.html        # Analytics dashboard
│   ├── login.html            # Authentication
│   └── register.html         # User registration
├── styles/                    # CSS stylesheets
│   ├── main.css              # Main styles
│   ├── responsive.css        # Responsive design
│   ├── marketplace.css       # Marketplace styles
│   └── inventory.css         # Inventory styles
├── scripts/                   # JavaScript files
│   ├── app.js                # Main application logic
│   ├── marketplace.js        # Marketplace functionality
│   ├── inventory.js          # Inventory management
│   ├── payment.js            # Payment integration
│   ├── speech.js             # Voice input
│   └── translations.js       # Multilingual support
├── assets/                    # Static assets
│   ├── images/               # Product images
│   └── icons/                # Application icons
├── server/                    # Backend files (PHP)
│   ├── auth.php              # Authentication
│   ├── payment.php           # Payment processing
│   └── database.php          # Database operations
└── components/                # Reusable UI components
    ├── navbar.html           # Navigation component
    ├── footer.html           # Footer component
    └── product-card.html     # Product display component
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (XAMPP, WAMP, or similar for PHP backend)
- Node.js (optional, for development tools)

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/streetconnect.git
   cd StreetConnect
   ```

2. **Setup Local Server**
   - Install XAMPP, WAMP, or similar local server
   - Place the project in the web server directory
   - Start Apache and MySQL services

3. **Database Setup** (Optional)
   ```sql
   -- Create database
   CREATE DATABASE streetconnect;
   
   -- Import sample data
   -- (SQL files will be provided)
   ```

4. **Configuration**
   - Update database credentials in `server/database.php`
   - Configure Razorpay keys in `scripts/payment.js`
   - Set up Firebase credentials (if using Firebase)

5. **Access Application**
   - Open browser and navigate to `http://localhost/StreetConnect`
   - The application should load with sample data

### Development Setup

1. **Install Dependencies** (Optional)
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   # Using PHP built-in server
   php -S localhost:8000
   
   # Or use your preferred local server
   ```

3. **File Watching** (Optional)
   ```bash
   # Watch for changes and auto-reload
   npm run dev
   ```

## 📱 Mobile-First Design

The application is built with a mobile-first approach, ensuring optimal experience across all devices:

- **Responsive Grid**: CSS Grid and Flexbox for flexible layouts
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Fast Loading**: Optimized images and minimal dependencies
- **Offline Support**: Local storage for basic functionality

## 🌍 Multilingual Features

### Supported Languages
- **English**: Primary language
- **Hindi**: हिंदी
- **Marathi**: मराठी
- **Tamil**: தமிழ்
- **Telugu**: తెలుగు

### Voice Input
- Speech-to-text functionality
- Language-specific recognition
- Voice commands for navigation

## 🔒 Security Features

- **HTTPS Ready**: Secure communication protocols
- **Input Validation**: Client and server-side validation
- **SQL Injection Protection**: Prepared statements
- **XSS Prevention**: Output encoding
- **CSRF Protection**: Token-based security

## 📊 Analytics & Insights

### Business Metrics
- Monthly spending analysis
- Cost savings tracking
- Popular product identification
- Supplier performance metrics

### Inventory Analytics
- Stock level trends
- Reorder point optimization
- Waste reduction insights
- Seasonal demand patterns

## 🤝 Community Features

### Vendor Network
- Connect with local suppliers
- Share best practices
- Collaborative purchasing
- Group discounts

### Expert Support
- Food safety guidance
- Regulatory compliance
- Business development tips
- Technical assistance

## 🔧 Customization

### Theme Customization
```css
:root {
    --primary-color: #FF6B35;    /* Main brand color */
    --secondary-color: #F7931E;  /* Accent color */
    --accent-color: #4CAF50;     /* Success color */
    /* Add more custom variables */
}
```

### Adding New Languages
1. Create translation file in `scripts/translations.js`
2. Add language button in HTML
3. Update speech recognition settings

### Extending Features
- Modular JavaScript architecture
- Component-based CSS
- Plugin-ready structure

## 🧪 Testing

### Manual Testing
- Cross-browser compatibility
- Mobile responsiveness
- Payment flow testing
- Voice input functionality

### Automated Testing (Future)
```bash
# Run tests
npm test

# E2E testing
npm run test:e2e
```

## 📈 Performance Optimization

- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Modular JavaScript loading
- **Caching**: Browser and service worker caching
- **Minification**: Compressed CSS and JS files

## 🚀 Deployment

### Production Setup
1. **Web Server**: Apache/Nginx configuration
2. **SSL Certificate**: HTTPS implementation
3. **Database**: Production database setup
4. **CDN**: Content delivery network
5. **Monitoring**: Error tracking and analytics

### Deployment Options
- **Shared Hosting**: Traditional web hosting
- **VPS**: Virtual private server
- **Cloud Platforms**: AWS, Google Cloud, Azure
- **Static Hosting**: Netlify, Vercel (frontend only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Include tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Street Food Vendors**: For inspiration and feedback
- **Open Source Community**: For libraries and tools
- **Design Community**: For UI/UX inspiration
- **Local Communities**: For cultural insights

## 📞 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Documentation](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)

### Contact
- **Email**: support@streetconnect.com
- **WhatsApp**: +91-XXXXXXXXXX
- **Community Forum**: [forum.streetconnect.com](https://forum.streetconnect.com)

### Bug Reports
Please use the [GitHub Issues](https://github.com/yourusername/streetconnect/issues) page to report bugs or request features.

---

**StreetConnect** - Empowering street food vendors with digital solutions for better business growth. 🚀 