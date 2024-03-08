from spleeter.separator import Separator

def separate_song(input_file, output_folder, stems=2):
    """
    Separates a song using Spleeter.

    Args:
        input_file (str): Path to the input song file.
        output_folder (str): Path to the output folder for separated stems.
        stems (int, optional): Number of stems to separate into. Defaults to 2. Allowed values are (2,4,5)
    """

    # Separate song using Spleeter
    separator = Separator(f"spleeter:{stems}stems")
    separator.separate_to_file(input_file, output_folder)

    print("Separation complete!")