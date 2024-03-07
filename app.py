from flask import Flask, jsonify
from spleeter.separator import Separator

app = Flask(__name__)

@app.route('/')
def home():
  return jsonify({"message": "Hello, World!"})

@app.route('/separate')
def separate_song():
  # Define file paths
  input_file = "test/satranga.mp3"
  output_folder = "output"

  # Separate song using Spleeter
  separator = Separator("spleeter:2stems")  # Separate into 2 stems
  separator.separate(audio_path=input_file, destination=output_folder)

  # Return success message
  return jsonify({"message": "complete"})

if __name__ == '__main__':
  app.run(debug=True)
