from flask import Flask, request, jsonify
from mysql.connector import Error
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models, transforms
import os
from flask_cors import CORS
from db_loader.db_config import config
from db_loader.db_connection import create_db_connection
from model.helper import predict_cuisine

app = Flask(__name__)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        file_path = 'temp_image.jpg'
        file.save(file_path)
        try:
            predicted_cuisine = predict_cuisine(file_path)
            return jsonify({'cuisine': predicted_cuisine})
        finally:
            os.remove(file_path)


@app.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant_by_id(restaurant_id):
    connection = create_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM Restaurant WHERE Restaurant_ID = %s', (restaurant_id,))
        restaurant = cursor.fetchone()
        connection.close()
        if restaurant:
            return jsonify(restaurant)
        else:
            return jsonify({"message": "Restaurant not found"}), 404
    else:
        return jsonify({"message": "Database connection error"}), 500


@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    connection = create_db_connection()
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        country = request.args.get('country')
        avg_cost = request.args.get('avg_cost')
        cuisines = request.args.get('cuisines')
        name = request.args.get('name') 

        query = 'SELECT * FROM Restaurant'
        params = []

        conditions = []
        if name:
            conditions.append('Restaurant_Name LIKE %s')
            params.append(f'%{name}%')

        if country:
            conditions.append('Country_Name = %s')
            params.append(country)

        if avg_cost:
            conditions.append('Avg_Cost_for_Two <= %s')
            params.append(avg_cost)

        if cuisines:
            conditions.append('Cuisines LIKE %s')
            params.append(f'%{cuisines}%')

        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)

        count_query = query.replace('SELECT *', 'SELECT COUNT(*)')
        cursor = connection.cursor()
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()[0] 

        query += ' LIMIT %s OFFSET %s'
        params.extend([per_page, (page - 1) * per_page])

        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params)
        results = cursor.fetchall()

        total_pages = (total_count + per_page - 1) // per_page  

        return jsonify({
            'restaurants': results,
            'totalPages': total_pages
        })

    except Error as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/search_by_location', methods=['GET'])
def search_by_location():
    connection = create_db_connection()
    try:
        lat = float(request.args.get('latitude'))
        lon = float(request.args.get('longitude'))
        radius = float(request.args.get('radius'))
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))

        lat_min = lat - radius
        lat_max = lat + radius
        lon_min = lon - radius
        lon_max = lon + radius

        query = '''
            SELECT * FROM Restaurant
            WHERE Latitude BETWEEN %s AND %s
            AND Longitude BETWEEN %s AND %s
        '''

        count_query = query
        count_query = count_query.replace('SELECT *', 'SELECT COUNT(*)')
        cursor = connection.cursor()
        cursor.execute(count_query, (lat_min, lat_max, lon_min, lon_max))
        total_count = cursor.fetchone()[0] 

        query += ' LIMIT %s OFFSET %s'
        params = (lat_min, lat_max, lon_min, lon_max, per_page, (page - 1) * per_page)

        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params)
        results = cursor.fetchall()

        total_pages = (total_count + per_page - 1) // per_page 

        return jsonify({
            'restaurants': results,
            'totalPages': total_pages
        })

    except Error as e:
        print(e)
        return jsonify({'error': str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


if __name__ == "__main__":
    app.run(debug=True)