from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/')
def serve_frontend():
    return send_from_directory('frontend', 'base.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend', path)

if __name__ == '__main__':
    app.run(port=8080, debug=True)
