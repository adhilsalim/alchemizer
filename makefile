# create-venv: Create a virtual environment
PHONY: create-venv
create-venv:
	pip install virtualenv
	virtualenv -p "D:\Python\Python310\python.exe" venv

# setup: Install all dependencies
PHONY: setup-spleeter
setup-spleeter:
	git clone https://github.com/deezer/spleeter.git
	pip install pytest pytest-xdist
	pip install musdb
	pip install museval
	pip install ffmpeg

# SELF: cd spleeter
# SELF: pip install .
# SELF: cd ..

# pip install flask
