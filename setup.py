from setuptools import setup, find_packages

with open("README.rst") as f:
    long_description = f.read()

setup(
    name="channel_app_template",
    version="0.0.98",
    packages=find_packages(),
    url="https://bitbucket.org/akinonteam/channel_app_template",
    description="Template app for Sales Channels",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="akinonteam",
    python_requires=">=3.5", #TODO Python 3.8+ for dataclasses?
    # We should pin the below to work with all the way from py27 to upto py39
    install_requires=["requests", "celery[redis]", "sentry_sdk", "flower"],
    classifiers=[
        "Development Status :: 5 - Production/Stable",
    ],
)
