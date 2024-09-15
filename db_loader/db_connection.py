import mysql.connector
from mysql.connector import Error
from db_loader.db_config import config

def create_db_connection():
    try:
        connection = mysql.connector.connect(**config)
        if connection.is_connected():
            print("Connected to MySQL Database")
        return connection
    except Error as e:
        print(e)
        return None