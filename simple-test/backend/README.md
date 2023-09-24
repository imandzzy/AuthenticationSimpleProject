# Using DockerDesktop
## In case you want to create your own custom container
You will need a specific contaier to run so you can create a Dockerfile and build it with desired/necessary extensions.

1. Create a `Dockerfile` in the directory where your project files are located.
   
2. Open the `Dockerfile` using a text editor and add the following lines to it:
```
# Use an official PHP runtime as a parent image
FROM php:7.4-apache

# Install the MySQLi extension
RUN docker-php-ext-install mysqli

WORKDIR /var/www/html

VOLUME ["/var/www/html"]

COPY . /var/www/html/

# You can add more desired commands

EXPOSE 80

CMD ["apache2-foreground"]
``` 
This `Dockerfile` starts with the official PHP Apache image and then installs the mysqli extension using the docker-php-ext-install command.

3. Save the `Dockerfile`
4. Build a new Docker image using the `Dockerfile`. Open a terminal/command prompt in the directory containing the Dockerfile and run the following command:
```
docker build -t my-php-image -f Dockerfile .

```
This command builds a new Docker image named `my-php-image` based on the instructions in your `Dockerfile`.
You can replace `my-php-image` with desired name.

5. Once the image is built successfully, you can run a container using this new image:
```
docker run -d -p 80:80 my-php-image
```
