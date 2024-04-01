from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# or, to allow only specific origins:
# cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

app.config['UPLOAD_FOLDER'] = 'uploads'

# Path to the Flask virtual environment
flask_venv_path = r"E:\_ADHIL\___PROJECTS\GITHUB\adhilsalim-alchemizer\backend\flask"

# Path to the Spleeter virtual environment
spleeter_venv_path = r"E:\_ADHIL\___PROJECTS\GITHUB\adhilsalim-alchemizer\backend\spleeter"

# Path to the Spleeter executable
spleeter_bin = os.path.join(spleeter_venv_path, "Scripts", "spleeter")

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

@app.route('/separate-audio', methods=['GET'])
def separate_audio():
    filename = request.args.get('filename')
    if filename:
        file_path = os.path.join('uploads', filename)
        output_dir = 'spleeter_output'
        
        # check whether the separated audio files already exist

        # Construct the Spleeter command
        command = [spleeter_bin, "separate", "-p", "spleeter:2stems", "-o", output_dir, file_path]

        try:
            # Run the Spleeter command
            subprocess.run(command, check=True, cwd=flask_venv_path, env=os.environ.copy())
            return jsonify({'message': 'Audio separation successful'})
        except subprocess.CalledProcessError as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'No file name provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)