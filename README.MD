# 📘 CSV MANAGER Documentation

## TABLE OF CONTENTS

<details>
<summary> <a href="#running-project">Running Project</a></summary>
<ol>
  <li>
  💾 Clone repository
  </li>
  <li>
  ⚙️ Backend
  </li>
  <li>
  🎨 Frontend
  </li>
    <li>
  🐋 Alternative - Docker
  </li>
</ol>
</details>
<details>
<summary> <a href="#endpoints">Endpoints</a></summary>
<ol>
  <li>
  🟢 GET /api/files/list
  </li>
  <li>
  🟡 POST /api/files
  </li>
  <li>
  🔴 DELETE /api/files
  </li>
    <li>
  🟢 GET /api/files/previev/ID
  </li>
    <li>
  🟡 POST /api/files/enrich/ID
  </li>
      <li>
  🟢 GET /api/files/columns/ID
  </li>
</ol>
</details>

## Running Project

### 💾 Clone repository

<br>

### ⚙️ Backend

a. Go to backend directory

```
cd backend
```

b. Create venv

```
python -m venv venv_name
```

c. Activate venv

```
venv_name/Scripts/activate
```

d. Install dependecies

```
pip install -r requirements.txt
```

e. Make and run migrations:

```
python manage.py makemigrations
```

```
python manage.py migrate
```

f. Start server on port 8000:

```
python manage.py runserver
```

<br>

### 🎨 Frontend

a. Go to frontend directory

```
cd frontend
```

b. Install dependencies

```
npm i
```

c. Start client on port 3000

```
npm start
```

<br>

### 🐋 Alternative - Docker

a. Run command:

```
docker compose up --build
```

b. Additionally you may switch database from default sqlite3 to postgres by going to backend/base/settings.py and switching comments this way:

```
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'yourdbname',
        'USER': 'yourdbuser',
        'PASSWORD': 'yourdbpassword',
        'HOST': 'db',
        'PORT': '5432',
    }
}
```

## Endpoints

### 🟢 GET api/file/list

📝 Gets list of uploaded files

<br>

### 🟡 POST api/file

📝 Uploads file

Example Body: `{file: [data.csv]}`

<br>

### 🔴 DELETE api/file

📝 Deletes file from database

Example Body: `{id: 1}`

<br>

### 🟢 GET api/file/preview/[ID]

📝 Previews file from given id - replace [ID] with number e.g. 1

<br>

### 🟡 POST api/file/enrich/[ID]

📝 Enriches file from given id - replace [ID] with number e.g. 1

<br>

### 🟢 GET api/file/columns/[ID]

📝 Shows the columns from file from given id - replace [ID] with number e.g. 1

<br>

## Additional notes:

- There is a possibility to use Celary to make UX even better but IMHO it would be overkill in this case
- On prod things like database credentials etc. should be in env variables not in file
