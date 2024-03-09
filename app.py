# Libraries
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'flask_cache' # temporary folder to store the uploaded audio file

@app.route('/', methods=['GET'])
def index():
    """
    This function renders the index.html page
    """
    return render_template('index.html')

@app.route('/test', methods=['GET'])
def test():
    """
    This function renders the test.html page
    """
    return render_template('test.html')

@app.route('/upload', methods=['POST'])
def upload():
    """
    This function uploads the audio file to the server and redirects to the create page
    """
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return redirect(url_for('create', file_path=file_path))

@app.route('/create', methods=['GET'])
def create():
    """
    Create page to display the audio file and the options to modify it
    """
    file_path = request.args.get('file_path')
    return render_template('create.html', file_path=file_path, os=os)

@app.route('/audio/<path:filename>')
def serve_audio(filename):
    """
    This function serves the audio file from the server
    """
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/getStem', methods=['POST'])
def get_stems():
    file_path = request.form.get('file_path')
    if file_path:
        stems = separate_song()
        return jsonify(stems)
    else:
        return jsonify([])



# GLOBAL FUNCTIONS
def separate_song():
    return [{"filename": "vocals", "filepath": "../output/vocals.wav"}, {"filename": "accompaniment", "filepath": "../output/accompaniment.wav"}]


if __name__ == '__main__':
    app.run(debug=True)