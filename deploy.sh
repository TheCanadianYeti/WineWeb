#!/bin/bash

echo "=========================================="
echo "Wine Collection - Apache Deployment"
echo "=========================================="
echo ""

# Check if running from correct directory
if [ ! -f "index.html" ]; then
    echo "ERROR: index.html not found in current directory"
    echo "Please run this script from /var/www/wineweb/"
    exit 1
fi

echo "Step 1: Creating directory structure..."
mkdir -p css
mkdir -p js

echo "Step 2: Setting file permissions..."
chmod 644 index.html .htaccess 2>/dev/null
chmod 644 css/style.css 2>/dev/null
chmod 644 js/script.js 2>/dev/null
chmod 755 css/ js/

echo "Step 3: Setting ownership to Apache user..."
sudo chown -R www-data:www-data /var/www/wineweb/

echo "Step 4: Enabling required Apache modules..."
sudo a2enmod headers 2>/dev/null
sudo a2enmod expires 2>/dev/null
sudo a2enmod deflate 2>/dev/null
sudo a2enmod rewrite 2>/dev/null

echo "Step 5: Testing Apache configuration..."
sudo apache2ctl configtest

if [ $? -eq 0 ]; then
    echo ""
    echo "Step 6: Restarting Apache..."
    sudo systemctl restart apache2
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "=========================================="
        echo "SUCCESS! Deployment complete."
        echo "=========================================="
        echo ""
        echo "Your wine collection site is now live!"
        echo ""
        echo "Next steps:"
        echo "1. Open your browser and visit your site"
        echo "2. Press F12 to open Developer Console"
        echo "3. Look for 'Data loaded: X wines' message"
        echo ""
        echo "If you see errors, check the console output"
        echo "or refer to README-APACHE.md for troubleshooting."
        echo ""
    else
        echo ""
        echo "ERROR: Failed to restart Apache"
        echo "Check Apache error logs: sudo tail -f /var/log/apache2/error.log"
        exit 1
    fi
else
    echo ""
    echo "ERROR: Apache configuration test failed"
    echo "Please check your Apache configuration files"
    echo "Run: sudo apache2ctl configtest"
    echo ""
    exit 1
fi

# Show file structure
echo "Current directory structure:"
echo ""
tree -L 2 2>/dev/null || find . -type f | sort

echo ""
echo "Deployment script completed!"
