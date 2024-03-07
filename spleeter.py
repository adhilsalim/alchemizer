from spleeter.separator import Separator

def separate_song(input_file="test/test.mp3", output_folder="output", stems=2):
    separator = Separator(f"spleeter:{stems}stems")  # Configure for desired number of stems
    separator.separate_to_file(input_file, output_folder)

    print("Separation complete!")

if __name__ == "__main__":
    separate_song()