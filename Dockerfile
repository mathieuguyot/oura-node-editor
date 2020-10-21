# pull official base image
FROM node:14.14.0-alpine

# set working directory
WORKDIR /app

# add `/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.3 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]
