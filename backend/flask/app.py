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
app.config['CONVERT_FOLDER'] = 'converted_audio'
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
    Uploads audio file to the server.

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
    """
    Retrieves the title of an audio file.

    This function retrieves the filename from the request arguments and attempts to locate the file in the upload folder.
    If the file is found, it reads the audio metadata and returns the title of the audio file.
    If the file is not found or if no filename is provided, appropriate error responses are returned.

    Returns:
        A JSON response containing the title of the audio file, or an error response if the file is not found or no filename is provided.
    """

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
    Serves an audio file.

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
                print('SERVER: error loading audio file:', e)
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
        If there is an error during the audio conversion, it returns a JSON response with the error message.
    """
    file_type = request.args.get('filetype')
    file_name = request.args.get('filename')

    print('SERVER:',file_name, file_type)

    if file_type == 'main':
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
    elif file_type == 'stem':
        input_path = os.path.join(app.config['SPLEETER_OUTPUT_FOLDER'], file_name + '.wav')
    else:
        print('SERVER: invalid file type')
        return jsonify({'error': 'Invalid file type'}), 400

    output_path = os.path.join(app.config['CONVERT_FOLDER'], file_name.replace('.mp3', ''))

    # print path
    print('SERVER:', input_path, output_path)

    # Convert to absolute paths
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath(output_path)

    # Determine the path to the Python interpreter in the virtual environment
    venv_python = os.path.join(flask_venv_path, 'Scripts', 'python.exe')

    # Run the tone-transfer.py script with the provided arguments
    try:
        result = subprocess.run(
            [venv_python, 'tone-transfer.py', input_path, output_path],
            capture_output=True, text=True, check=True
        )

        # Check for specific error message
        output_message = result.stdout.strip()
        if 'device-compatibility-error' in output_message:
            return jsonify({'error': 'Audio conversion failed due to device compatibility issues'}), 500
        
        return jsonify({'message': 'Audio conversion successful'}), 200
    except subprocess.CalledProcessError as e:
        print('SERVER: Error running tone-transfer.py:', e)
        return jsonify({'error': 'Audio conversion failed', 'details': e.stderr}), 500

    
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
    stems = request.args.get('stems')
    if filename:
        file_path = os.path.join('uploads', filename)
        output_dir = 'spleeter_output'

        # [TO-DO] check whether the separated audio files already exist

        command = [spleeter_bin, "separate", "-p", "spleeter:" + stems, "-o", output_dir, file_path]

        try:
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
    app.run(debug=True)