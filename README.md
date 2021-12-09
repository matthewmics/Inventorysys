## Prerequisites

Composer
https://getcomposer.org/

NodeJS
https://nodejs.org/en/download/

Postgresql12 | Download Windows x86-64 - Version: 12
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

## Running the API

Open cmd and "cd" (change directory) to API folder of the project directory
```
cd path_to_project/API
```
Execute the following commands
```
composer install

php artisan migrate

php artisan serve --port=5000
```

## Running the Front end

Open cmd and "cd" (change directory) to UI folder of the project directory
```
cd path_to_project/UI
```
Execute the following commands
```
npm install

npm run serve
```

on your browser address bar, navigate to http://127.0.0.1:5000/api/reseed  
to reset and re-populate the database  

Check http://127.0.0.1:8000/ to see if it works

Admin login  
Username: admin@inventory.com  
Password: admin  


