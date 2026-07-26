#!/bin/sh
set -e

# Generate storage link
php artisan storage:link --force || true

# Cache configurations, routes, and views for production performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

exec supervisord -c /etc/supervisord.conf
