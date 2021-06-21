# pull an official base image from docker-hub
FROM node:14.17-alpine

# add maintainer label (meta-data)
LABEL maintainer="Ayushman Tripathy <https://github.com/ayushmantripathy9>"

# set the working directory to the root of the filesystem
WORKDIR /

# update the repositories
RUN apk update

# install yarn in order to install dependencies
RUN apk add yarn

# copy the frontend code folder to the image's filesystem
COPY ./groot ./groot

# change the working directory to frontend dir in the filesystem
WORKDIR /groot

# install all the dependencies of frontend from file package.json
RUN yarn
