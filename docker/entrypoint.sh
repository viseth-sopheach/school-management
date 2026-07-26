#!/bin/sh
set -e

php artisan config:cache
php artisan migrate --force

exec supervisord -c /etc/supervisord.conf
