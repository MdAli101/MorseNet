from flask import Flask, render_template

app = Flask(
    __name__,
    template_folder="../front-end/templates",
    static_folder="../front-end/static"
)

@app.route("/")
def home():
    return render_template("home.html", title="Home")

@app.route("/user")
def user_page():
    return render_template("user.html", title="User Page")

@app.route("/admin")
def admin_page():
    return render_template("admin.html", title="Admin Page")

@app.route("/department")
def department_page():
    return render_template("department.html", title="Department Page")

if __name__ == "__main__":
    app.run(debug=True)
