FROM richarvey/nginx-php-fpm:3.1.6

ENV WEBROOT=/var/www/html/public
ENV RUN_SCRIPTS=1
ENV PHP_VERSION=8.3

# nginx-php-fpm listens on 8080 by default in this image
EXPOSE 8080

WORKDIR /var/www/html

COPY . /var/www/html/

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
    && chmod +x /var/www/html/scripts/00-laravel-deploy.sh
