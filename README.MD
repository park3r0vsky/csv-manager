# 📁 CSV MANAGER Documentation

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
  Frontend
  </li>
</ol>
</details>
<details>
<summary> <a href="#endpoints">Endpoints</a></summary>
<ol>
  <li>
  GET /api/files/list
  </li>
  <li>
  POST /api/files
  </li>
  <li>
  DELETE /api/files
  </li>
    <li>
  GET /api/files/previev/ID
  </li>
      <li>
  POST /api/files/enrich/ID
  </li>
</ol>
</details>

## Running Project

### 💾 Clone repository

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

f. Start on port 8000:

```
python manage.py runserver
```

### 🎨 Frontend

a. Go to frontend directory

```
cd frontend
```

<br>

## Endpoints

### 🟢 GET api/file/list

### 🟡 POST api/file

### 🔴 DELETE api/file

### 🟢 GET api/file/preview/[ID]

### 🟡 POST api/file/enrich/[ID]
