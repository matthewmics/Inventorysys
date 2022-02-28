cd API_2

call composer install

php artisan migrate

php artisan serve --port=5000 --host 0.0.0.0

cmd /k