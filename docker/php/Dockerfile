FROM php:8.3-fpm-alpine

  RUN apk add --no-cache \
      bash \
      curl \
      git \
      icu-dev \
      libzip-dev \
      oniguruma-dev \
      unzip \
      zip \
      mysql-client \
   && docker-php-ext-install \
      intl \
      mbstring \
      pdo_mysql \
      zip

  COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

  WORKDIR /var/www/html

  CMD ["php-fpm"]