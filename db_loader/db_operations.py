import pandas as pd
from mysql.connector import Error

def create_tables(connection):
    try:
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Country (
                Country_Code INT PRIMARY KEY,
                Country VARCHAR(100)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Restaurant (
                Restaurant_ID INT PRIMARY KEY,
                Restaurant_Name VARCHAR(255),
                Country_Code INT,
                Country_Name VARCHAR(100),
                City VARCHAR(100),
                Address TEXT,
                Locality VARCHAR(100),
                Locality_Verbose VARCHAR(255),
                Longitude FLOAT,
                Latitude FLOAT,
                Cuisines VARCHAR(255),
                Avg_Cost_for_Two INT,
                Currency VARCHAR(50),
                Has_Table_Booking BOOLEAN,
                Has_Online_Delivery BOOLEAN,
                Is_Delivering_Now BOOLEAN,
                Switch_to_Order_Menu BOOLEAN,
                Price_Range INT,
                Aggregate_Rating FLOAT,
                Rating_Color VARCHAR(50),
                Rating_Text VARCHAR(50),
                Votes INT,
                FOREIGN KEY (Country_Code) REFERENCES Country(Country_Code)
            )
        ''')
        connection.commit()
        print("Tables created successfully")
    except Error as e:
        print(e)
        connection.rollback()

def load_data_to_db(connection):
    try:
        country_df = pd.read_excel('data/Country-Code.xlsx', engine='openpyxl')
        zomato_df = pd.read_csv('data/zomato.csv', encoding='latin-1')
        zomato_df = pd.merge(zomato_df, country_df, how='left', left_on='Country Code', right_on='Country Code')
        cursor = connection.cursor()

        for _, row in country_df.iterrows():
            cursor.execute('''
                INSERT INTO Country (Country_Code, Country)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE Country = VALUES(Country)
            ''', (int(row['Country Code']), row['Country']))

        zomato_df['Has Table booking'] = zomato_df['Has Table booking'].map({'Yes': True, 'No': False})
        zomato_df['Has Online delivery'] = zomato_df['Has Online delivery'].map({'Yes': True, 'No': False})
        zomato_df['Is delivering now'] = zomato_df['Is delivering now'].map({'Yes': True, 'No': False})
        zomato_df['Switch to order menu'] = zomato_df['Switch to order menu'].map({'Yes': True, 'No': False})

        zomato_df = zomato_df.where(pd.notnull(zomato_df), None)

        for _, row in zomato_df.iterrows():
            cursor.execute('''
                INSERT INTO Restaurant (Restaurant_ID, Restaurant_Name, Country_Code, Country_Name, City, Address, Locality, Locality_Verbose, 
                                        Longitude, Latitude, Cuisines, Avg_Cost_for_Two, Currency, Has_Table_Booking, 
                                        Has_Online_Delivery, Is_Delivering_Now, Switch_to_Order_Menu, Price_Range, 
                                        Aggregate_Rating, Rating_Color, Rating_Text, Votes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE Restaurant_ID = VALUES(Restaurant_ID), Restaurant_Name = VALUES(Restaurant_Name), Country_Code = VALUES(Country_Code),
                                      Country_Name = VALUES(Country_Name), City = VALUES(City), Address = VALUES(Address),
                                      Locality = VALUES(Locality), Locality_Verbose = VALUES(Locality_Verbose), Longitude = VALUES(Longitude), 
                                      Latitude = VALUES(Latitude), Cuisines = VALUES(Cuisines), Avg_Cost_for_Two = VALUES(Avg_Cost_for_Two),
                                      Currency = VALUES(Currency), Has_Table_Booking = VALUES(Has_Table_Booking),
                                      Has_Online_Delivery = VALUES(Has_Online_Delivery), Is_Delivering_Now = VALUES(Is_Delivering_Now),
                                      Switch_to_Order_Menu = VALUES(Switch_to_Order_Menu), Price_Range = VALUES(Price_Range),
                                      Aggregate_Rating = VALUES(Aggregate_Rating), Rating_Color = VALUES(Rating_Color),
                                      Rating_Text = VALUES(Rating_Text), Votes = VALUES(Votes)
            ''', (
                int(row['Restaurant ID']), row['Restaurant Name'], int(row['Country Code']), row['Country'], row['City'], row['Address'], row['Locality'],
                row['Locality Verbose'], row['Longitude'], row['Latitude'], row['Cuisines'], row['Average Cost for two'],
                row['Currency'], row['Has Table booking'], row['Has Online delivery'],
                row['Is delivering now'], row['Switch to order menu'], row['Price range'],
                row['Aggregate rating'], row['Rating color'], row['Rating text'], row['Votes']
            ))

        connection.commit()
        print("Data loaded successfully")

    except Error as e:
        print(e)
        connection.rollback()