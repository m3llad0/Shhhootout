# start by pulling the python image
FROM python:3.8-alpine

RUN addgroup -S flask-app && adduser -S flask-app -G flask-app

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# copy every content from the local file to the image
COPY --chown=flask-app:flask-app . /app

USER flask-app

# configure the container to run in an executed manner

CMD [ "python", "-m" , "flask", "run", "--host=0.0.0.0"]
