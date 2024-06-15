from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from mutagen.mp3 import MP3
from dotenv import load_dotenv
import os
import subprocess
import requests

app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app)
# or, to allow only specific origins:
# cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Youtube data api configuration
YOUTUBE_DATA_API_KEY = os.environ.get('YOUTUBE_DATA_API_KEY')
YOUTUBE_DATA_ENDPOINT = "https://www.googleapis.com/youtube/v3/search"

# Folder configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SPLEETER_OUTPUT_FOLDER'] = 'spleeter_output'

# Spleeter stem configuration
STEM_DICT = {"2stems": ["vocals", "accompaniment"], "4stems": ["vocals", "drums", "bass", "other"], "5stems": ["vocals", "drums", "bass", "piano", "other"]}

# Path configuration
flask_venv_path = r"E:\_ADHIL\___PROJECTS\GITHUB\adhilsalim-alchemizer\backend\flask"
spleeter_venv_path = r"E:\_ADHIL\___PROJECTS\GITHUB\adhilsalim-alchemizer\backend\spleeter"
spleeter_bin = os.path.join(spleeter_venv_path, "Scripts", "spleeter")

# Create upload folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    print('Namaskaram 🙏')
    return '<h1>Namskaram 🙏</h1>'


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Uploads a file to the server.

    Returns:
        A JSON response containing the status of the file upload.
    """
    
    file = request.files['file']
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        print('SERVER: file ', filename,' uploaded.')
        return jsonify({'message': 'File uploaded successfully', 'filename': filename})
    else:
        print('SERVER:  file upload failed.')
        return jsonify({'error': 'No file uploaded'})

@app.route('/get-audio-title', methods=['GET'])
def get_audio_title():
    filename = request.args.get('filename')

    if filename:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(file_path):
            try:
                audio = MP3(file_path)
                title = audio['TIT2'].text[0] if 'TIT2' in audio else 'Unknown'
                return jsonify({'title': title})
            except Exception as e:
                print('SERVER: error getting title from the audio', e)
                return jsonify({'error': str(e)}), 500
        else:
            print('SERVER: file missing on server: ', filename)
            return jsonify({'error': 'File not found'}), 404

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

    filename = request.args.get('filename')
    filetype = request.args.get('filetype')
    stemname = request.args.get('stemname')

    print('SERVER: loading audio file:', filename, filetype, stemname)

    if filename:
        if filetype == "stem":
            file_path = os.path.join(app.config['SPLEETER_OUTPUT_FOLDER'], filename, stemname + ".wav")
        else:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if os.path.isfile(file_path):
            try:
                response = make_response(send_file(file_path, as_attachment=True))
                response.headers['Content-Type'] = 'audio/mpeg'
                return response
            except Exception as e:
                print('Error:', e)
                return jsonify({'error': str(e)}), 500
        else:
            print('SERVER: file missing on server: ', filename)
            return jsonify({'error': 'File not found'}), 404
    else:
        print('SERVER: no file name provided')
        return jsonify({'error': 'No file name provided'}), 400
    

@app.route('/convert-audio', methods=['GET'])
def convert_audio():
    """
    This function converts an instrument stem to a different instrument using Google Tone Transfer.
    
    Returns:
        If the audio conversion is successful, it returns a JSON response with a success message.
        If there is an error during the audio conversion, it returns a JSON response with the error message."""
    file_type = request.args.get('filetype')
    file_name = request.args.get('filename')

    print('file type:', file_type)
    print('file name:', file_name)

    if file_type == 'stem':
        pass
    elif file_type == 'main':
        pass
    else:
        print('error: no file type provided')
        return jsonify({'error': 'No file type provided'}), 400

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
    print('SERVER: separating audio.')
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
            print('SERVER: Running command:', command)
            subprocess.run(command, check=True, cwd=flask_venv_path, env=os.environ.copy())
            return jsonify({'message': 'Audio separation successful'})
        except subprocess.CalledProcessError as e:
            print('SERVER: Error running Spleeter:', e)
            return jsonify({'error': str(e)}), 500
    else:
        print('SERVER: no file name provided')
        return jsonify({'error': 'No file name provided'}), 400

@app.route('/search-song', methods=['POST', 'GET'])
def search_song():
    print('SERVER: searching song.')
    query = request.args.get('query')
    params = {
        'part': 'snippet',
        'q': query + 'song or music',
        'type': 'video',
        'key': YOUTUBE_DATA_API_KEY
    }

    try:
        response = requests.get(YOUTUBE_DATA_ENDPOINT, params=params)
        return response.json()
    except Exception as e:
        print('SERVER: error searching song:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('Starting server...')
    app.run(debug=True)