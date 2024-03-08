"""
SPLEETER.PY

The spleeter package is in the same directory as this file.
This program may work properly even if the spleeter package is not in the same directory.
Provided that the spleeter package is installed in the system.

Change the input_file and output_folder variables to the desired file paths.
The input_file variable should contain the path to the song to be separated.
The output_folder variable should contain the path to the folder where the separated stems will be saved.
stems variable should contain the number of stems to separate the song into.
available stem values are 2, 4, and 5.
"""
from spleeter.separator import Separator

def separate_song(input_file="test/test.mp3", output_folder="output", stems=2):
    separator = Separator(f"spleeter:{stems}stems") 
    separator.separate_to_file(input_file, output_folder)
    print("Separation complete!")

if __name__ == "__main__":
    separate_song()