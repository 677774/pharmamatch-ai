FROM python:3.10

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Menyalin seluruh file backend
COPY . .

# Hugging Face menggunakan port 7860 secara default
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
