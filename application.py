from flask import Flask, render_template, jsonify
# import sass
from academics import getCourses

application = Flask(__name__)
# sass.compile(dirname=('sass', 'static/css'))


@application.route('/', methods=['GET'])
@application.route('/home', methods=['GET'])
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        print(e)
        return "Home page currently not available"


@application.route('/undergraduate', methods=['GET'])
def fetchUndergrad():
    try:
        return jsonify(getCourses('undergradclasses'))
    except Exception as e:
        print(e)
        return {"Failed": {"subject_name": "Database Operations Failed", "filter_name": "Diagnostics"}}


@application.route('/graduate', methods=['GET'])
def fetchGrad():
    try:
        return jsonify(getCourses('gradclasses'))
    except Exception as e:
        print(e)
        return {"Failed": {"subject_name": "Database Operations Failed", "filter_name": "Diagnostics"}}


if __name__ == "__main__":
    application.run()
