# pull an official base image from docker-hub
FROM nginx:alpine

# add maintainer label (meta-data)
LABEL maintainer="Ayushman Tripathy <https://github.com/ayushmantripathy9>"

WORKDIR /

WORKDIR /etc/nginx

RUN rm -f ./conf.d/default.conf

ADD ./conf.d ./conf.d
