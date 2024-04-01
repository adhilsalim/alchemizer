from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# or, to allow only specific origins:
# cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

app.config['UPLOAD_FOLDER'] = 'uploads'

# Create upload folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    return '<h1>Server is running</h1>'

@app.route('/upload', methods=['POST'])
def upload_file():
    print('uploading file...')
    file = request.files['file']
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        print('File uploaded:', filename)
        return jsonify({'message': 'File uploaded successfully', 'filename': filename})
    else:
        print('No file uploaded')
        return jsonify({'message': 'No file uploaded'})

@app.route('/load-audio', methods=['GET'])
def load_audio():
    filename = request.args.get('filename')
    if filename:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    else:
        return jsonify({'error': 'No file name provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)