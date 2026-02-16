# Wine Collection - Apache Server Setup

## Directory Structure

Your Apache server at `/var/www/wineweb/` should have the following structure:

```
/var/www/wineweb/
├── index.html
├── .htaccess
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Setup Instructions

1. **Upload Files**
   - Place `index.html` and `.htaccess` in `/var/www/wineweb/`
   - Create a `css` folder and put `style.css` inside it
   - Create a `js` folder and put `script.js` inside it

2. **Apache Configuration**
   
   Make sure these Apache modules are enabled:
   ```bash
   sudo a2enmod headers
   sudo a2enmod expires
   sudo a2enmod deflate
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

3. **Permissions**
   ```bash
   cd /var/www/wineweb/
   chmod 644 index.html .htaccess
   chmod 644 css/style.css
   chmod 644 js/script.js
   chmod 755 css/
   chmod 755 js/
   ```

4. **AllowOverride Setting**
   
   Make sure your Apache configuration allows .htaccess files.
   
   Check your Apache site configuration (likely `/etc/apache2/sites-available/wineweb.conf` or similar):
   ```apache
   <VirtualHost *:80>
       ServerName your-domain.com
       DocumentRoot /var/www/wineweb
       
       <Directory /var/www/wineweb>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

   Then restart Apache:
   ```bash
   sudo systemctl restart apache2
   ```

5. **Verify Apache Configuration**
   ```bash
   # Test configuration syntax
   sudo apache2ctl configtest
   
   # Should output "Syntax OK"
   
   # If OK, restart Apache
   sudo systemctl restart apache2
   ```

## Quick Deployment Script

Save this as `deploy.sh` and run it to set up everything:

```bash
#!/bin/bash

# Navigate to your web directory
cd /var/www/wineweb/

# Create directories if they don't exist
mkdir -p css
mkdir -p js

# Set permissions
chmod 644 index.html .htaccess 2>/dev/null
chmod 644 css/style.css 2>/dev/null
chmod 644 js/script.js 2>/dev/null
chmod 755 css/ js/

# Set ownership (adjust 'www-data' if your Apache user is different)
sudo chown -R www-data:www-data /var/www/wineweb/

# Enable required Apache modules
sudo a2enmod headers expires deflate rewrite

# Test Apache configuration
sudo apache2ctl configtest

# If test passed, restart Apache
if [ $? -eq 0 ]; then
    sudo systemctl restart apache2
    echo "Deployment complete! Visit your site to test."
else
    echo "Apache configuration test failed. Please check your config."
fi
```

Run with:
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

## Troubleshooting

### Stats Not Showing
1. Open browser console (F12)
2. Look for "Data loaded: X wines" message
3. Check for any CORS or network errors

### CSS Not Loading
1. Check file path: should be `css/style.css`
2. Verify folder exists and has proper permissions
3. Check browser console for 404 errors

### JavaScript Errors
1. Make sure `js/script.js` exists
2. Verify PapaParse CDN is loading
3. Check browser console for errors

### Common Apache Issues

**Problem**: .htaccess not working
**Solution**: Ensure `AllowOverride All` is set in Apache config

**Problem**: Wrong MIME types
**Solution**: The .htaccess file sets correct MIME types

**Problem**: UTF-8 encoding issues
**Solution**: .htaccess forces UTF-8 encoding

## Testing Locally

If testing on your development machine:
1. Install Apache
2. Place files in `/var/www/html/` (Linux) or `C:\xampp\htdocs\` (Windows with XAMPP)
3. Access via `http://localhost/`

## Browser Console Commands for Debugging

Open browser console (F12) and type:
```javascript
// Check if wines loaded
console.log('Wines loaded:', wines.length);

// Check current theme
console.log('Current theme:', document.documentElement.getAttribute('data-theme'));

// Check if stats elements exist
console.log('Total count element:', document.getElementById('total-count'));
console.log('Display count element:', document.getElementById('display-count'));
```

## Performance Tips

The .htaccess file includes:
- UTF-8 encoding enforcement
- GZIP compression for faster loading
- Browser caching for static files
- Proper MIME types for all resources

## Security

- Directory listing is disabled
- Only necessary headers are sent
- CORS is configured for Google Sheets access only
