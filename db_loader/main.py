from db_loader.db_connection import create_db_connection
from db_loader.db_operations import create_tables, load_data_to_db

if __name__ == "__main__":
    connection = create_db_connection()
    if connection:
        create_tables(connection)
        load_data_to_db(connection)
        connection.close()