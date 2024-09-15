# zomatoDB

### Load the data into the MySQL database
Config details can be edited at ```db_loader/db_config.py```
```
python -m db_loader.main
```

### Run the Flask backend application to serve API endpoints
```
python -m endpoints.app
```

### Run the React UI application
```
cd ui
npm start
```