#!/usr/bin/env python3
""" language translation module """
from flask import (Flask, g, render_template, request)
from flask_babel import Babel
from typing import List, Dict, Optional


class Config:
    """ app config class """
    LANGUAGES: List[str] = ['en', 'fr']
    BABEL_DEFAULT_LOCALE: str = "en"
    BABEL_DEFAULT_TIMEZONE: str = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """ returns language to display """
    locale = request.args.get("locale")
    if not locale:
        if g.user:
            locale = g.user["locale"]
            if locale not in app.config["LANGUAGES"]:
                locale = request.accept_languages.best_match(
                        app.config["LANGUAGES"]
                        )
        else:
            locale = request.accept_languages.best_match(
                    app.config["LANGUAGES"]
                    )
    return locale 


@app.route('/', strict_slashes=False)
def index() -> str:
    """ root url """
    return render_template('6-index.html')


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> Optional[Dict]:
    """ returns user dictionary or none if user id cannot be found """
    user_id = request.args.get("login_as")
    if user_id and int(user_id) in users.keys():
        return users[int(user_id)]
    return None


@app.before_request
def before_request():
    """ method executes before every other method """
    g.user = get_user()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
