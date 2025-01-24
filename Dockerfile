# Usar la imagen oficial de PHP con Apache
FROM php:8.0-apache

# Instalar extensiones adicionales de PHP necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar el módulo mod_rewrite en Apache
RUN a2enmod rewrite

# Permitir archivos .htaccess sobrescriban configuraciones locales
RUN sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Instalar Node.js y npm
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Verificar la instalación de Node.js y npm
RUN node -v && npm -v

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Verificar la instalación de Composer
RUN composer --version

# Copiar los archivos del proyecto al contenedor
COPY . /var/www/html/

# Exponer el puerto 80 para el servidor web
EXPOSE 80

# Comando por defecto para iniciar el servidor Apache
CMD ["apache2-foreground"]
