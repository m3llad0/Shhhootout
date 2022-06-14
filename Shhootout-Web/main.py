from flask import Flask, render_template, request

app = Flask(__name__)
            
            
def get_template_parameters():
    values = {}
    return values

@app.route('/',methods=['GET','POST'])
def root():
    return render_template('start.html')

@app.route('/splash',methods=['GET'])
def splash():
    return render_template('splash.html')

@app.route('/home', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/play', methods=['GET'])
def play():
    return render_template('shootout.html')

@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

@app.route('/guide',methods=['GET'])
def guide():
    return render_template('guide.html')



