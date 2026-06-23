FROM php:8.3-cli-alpine

WORKDIR /app

# PostgreSQL client + PDO
RUN apk add --no-cache postgresql-libs \
    && docker-php-ext-install pdo_pgsql

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --optimize-autoloader

COPY . .

EXPOSE 10000

CMD ["php", "-S", "0.0.0.0:10000", "-t", "/app"]
