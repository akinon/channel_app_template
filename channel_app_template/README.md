
# Sphinx Documentation Management

Follow the steps below to manage the Sphinx documentation:

```
cd docs
make clean # If clean is not run, 'make html' only builds the differences 
make html
```

Then you can access the documentation via `docs/build/html/index.html`

Link on how to publish the docs on ReadTheDocs:
https://sphinx-rtd-tutorial.readthedocs.io/en/latest/read-the-docs.html


## Multiple Languages

Documentation is written in Turkish but the docstring language is obviously in English.
Because of this, translation gets very complex. If we follow the steps below, it would make the
translation process simpler. Because in the current scenario, 
docstring texts are also put in .po files, if source language 
is Turkish, .po files will contain both Turkish and English text.

If I were to make this documentation support multiple languages, I would first translate it to English,
store the original Turkish language docs somewhere, use the main language as English and generate 
translation files from English and set target language as Turkish. 
I would then paste the translations to Turkish language files, build and complete.
If new languages are requested, I would set that target language, fill the .po files, build and complete.


### Multiple Language Command Steps
Run all the commands below in the `docs/` folder.

Documentation has its separate requirements.txt file you must install them to run some of the commands below.
It is also recommended to pin the Sphinx version in the `docs/requirements.txt`
```
pip install -r requirements.txt
```

You can update the main language by updating `docs/conf.py`

```python
language = 'tr'
# language = 'en'
```

Extract translatable messages into .pot files.
```
make gettext
```

Set English and German as the target language and generate .po files from the .pot files.
```
sphinx-intl update -p build/gettext -l en -l de
```

Now you can access the .po files from `docs/locale/<language>/LC_MESSAGES/*` 

After the translation is done, you need to run `make html` with specific parameters so that
documentation is built into the target language.

```
make -e SPHINXOPTS="-D language='de'" html
```
