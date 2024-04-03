from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from mutagen.mp3 import MP3
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
    print('Server is running')
    return '<h1>Server is running</h1>'

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Uploads a file to the server.

    Returns:
        A JSON response containing the status of the file upload.
    """
    print('uploading file...')
    file = request.files['file']
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        print('File uploaded:', filename)
        return jsonify({'message': 'File uploaded successfully', 'filename': filename})
    else:
        print('error: no file uploaded')
        return jsonify({'error': 'No file uploaded'})

@app.route('/load-audio', methods=['GET'])
def load_audio():
    """
    Load and serve an audio file.

    This function retrieves the filename from the request arguments and attempts to locate the file in the upload folder.
    If the file is found, it reads the audio metadata, sets the appropriate response headers, and returns the audio file as a response.
    If the file is not found or if no filename is provided, appropriate error responses are returned.

    Returns:
        A Flask response object containing the audio file, or an error response if the file is not found or no filename is provided.
    """
    print('loading audio...')
    filename = request.args.get('filename')
    if filename:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(file_path):
            print('File found:', filename)
            try:
                response = make_response(send_file(file_path, as_attachment=True))
                response.headers['Content-Type'] = 'audio/mpeg'
                return response
            except Exception as e:
                print('Error:', e)
                return jsonify({'error': str(e)}), 500
        else:
            print('File not found:', filename)
            return jsonify({'error': 'File not found'}), 404
    else:
        print('error: no file name provided')
        return jsonify({'error': 'No file name provided'}), 400

@app.route('/get-audio-title', methods=['GET'])
def get_audio_title():
    print('getting audio title...')
    filename = request.args.get('filename')

    if filename:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        print('DEBUG - file path:', file_path)
        if os.path.isfile(file_path):
            try:
                audio = MP3(file_path)
                title = audio['TIT2'].text[0] if 'TIT2' in audio else 'Unknown'
                print('file title:', title)
                return jsonify({'title': title})
            except Exception as e:
                print('Error:', e)
                return jsonify({'error': str(e)}), 500
        else:
            print('File not found:', filename)
            return jsonify({'error': 'File not found'}), 404

@app.route('/separate-audio', methods=['GET'])
def separate_audio():
    """
    This function separates the audio file into different stems using Spleeter.

    Returns:
        If the audio separation is successful, it returns a JSON response with a success message.
        If there is an error during the audio separation, it returns a JSON response with the error message.

    Raises:
        subprocess.CalledProcessError: If there is an error while running the Spleeter command.

    """
    print('separating audio...')
    filename = request.args.get('filename')
    stems = request.args.get('stems') # example: 2stems, 4stems, 5stems
    print('args:', filename, stems)
    if filename:
        file_path = os.path.join('uploads', filename)
        output_dir = 'spleeter_output'
        
        # check whether the separated audio files already exist

        # Construct the Spleeter command
        command = [spleeter_bin, "separate", "-p", "spleeter:" + stems, "-o", output_dir, file_path]

        try:
            # Run the Spleeter command
            print('Running command:', command)
            subprocess.run(command, check=True, cwd=flask_venv_path, env=os.environ.copy())
            return jsonify({'message': 'Audio separation successful'})
        except subprocess.CalledProcessError as e:
            print('Error:', e)
            return jsonify({'error': str(e)}), 500
    else:
        print('error: no file name provided')
        return jsonify({'error': 'No file name provided'}), 400

if __name__ == '__main__':
    print('Starting server...')
    app.run(debug=True)