import os
from flask import Flask, render_template, request
import spleeter

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Set the upload folder

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Check if a file was uploaded
        if 'file' not in request.files:
            return 'No file uploaded', 400

        file = request.files['file']

        # Save the uploaded file
        if file.filename != '':
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)

            # Run Spleeter model on the uploaded file
            spleeter_separate(file_path)

            # Remove the uploaded file
            os.remove(file_path)

        return 'File uploaded and processed successfully'

    return render_template('index.html')

def spleeter_separate(file_path):
    # Create an output directory
    output_dir = 'output/'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Run Spleeter
    spleeter.separate_to_path(
        file_path,
        output_dir,
        codec='mp3',
        bitrate='128k',
        softmask=True,
        multiprocess=True
    )

if __name__ == '__main__':
    app.run(debug=True)