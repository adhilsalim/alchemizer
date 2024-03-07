PHONY: setup-windows
setup-windows:
	pip install virtualenv
	virtualenv -p "D:\Python\Python310\python.exe" venv
	venv\Scripts\activate
	pip install flask
	git clone https://github.com/deezer/spleeter.git
	pip install pytest pytest-xdist
	pip install musdb
	pip install museval
	cd spleeter
	pip install .
	cd ..
	pip install -r requirements.txt

PHONY: setup-linux
setup-linux:
	pip install virtualenv
	virtualenv venv
	source venv/bin/activate
	pip install flask
	pip install -r requirements.txt

PHONY: run-windows
run-windows:
	venv\Scripts\activate

PHONY: run-linux
run-linux:
	source venv/bin/activate
