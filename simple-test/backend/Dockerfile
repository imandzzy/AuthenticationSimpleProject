# Use an official PHP runtime as a parent image
FROM php:7.4-apache

# Install the MySQLi extension
RUN docker-php-ext-install mysqli

WORKDIR /var/www/html

VOLUME ["/var/www/html"]

COPY . /var/www/html/

EXPOSE 80

CMD ["apache2-foreground"]