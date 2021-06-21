# pull an official base image from docker-hub
FROM python:3.9.5-alpine

# add maintainer label (meta-data)
LABEL maintainer="Ayushman Tripathy <https://github.com/ayushmantripathy9>"

# setup the environment variables 
## To stop buffering of logs and printing them as they come
ENV PYTHONUNBUFFERED 1 

RUN addgroup --system django && adduser --system -G django django

# update the repositories source list and add packages
RUN apk update \
    && apk add --no-cache --virtual .build-deps \
    && apk add postgresql-dev \
    && apk add gcc python3-dev musl-dev \
    && apk add libffi-dev openssl-dev jpeg-dev zlib-dev libjpeg cargo

# make the required utility upgrades
RUN pip install --upgrade pip \ 
    && pip install --upgrade setuptools \ 
    && pip install --upgrade pipenv \ 
    && pip install --upgrade supervisor

# change the working directory to root of image's filesystem
WORKDIR /

# copy the requirements file from project to image's filesystem
COPY ./requirements.txt ./requirements.txt

# install all required dependencies for backend in the filesystem
RUN pip install -r requirements.txt

# free-up the disk space
RUN apk del .build-deps python3-dev musl-dev gcc zlib-dev openssl-dev
RUN rm -Rf ~/.cache

# copy the backend code folder to the image's filesystem
COPY ./code ./code

# finally set the working directory to /code, where one would work 
WORKDIR /code
