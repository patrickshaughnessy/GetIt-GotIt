# Dockerfile
# The FROM directive sets the Base Image for subsequent instructions
FROM debian:jessie

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set environment variables
ENV appDir /var/www/current

# Run updates and install dependencies
RUN apt-get update

# Install needed deps and clean up after
RUN apt-get install -y -q -no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    g++ \
    gcc \
    git \
    make \
    nginx \
    sudo \
    wget \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoclean

# Install nvm to manage node
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.1.0

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/version/node/v$NODE_VERSION/bin:$PATH

# Set work directory
# - set it here because it affects RUN, CMD, ENTRYPOINT, COPY, ADD instructions

RUN mkdir -p /var/www/app/current
WORKDIR ${appDir}

# Add package.json and install before adding application files
ADD package.json ./
RUN npm i --production

# Install pm2 globally so we can run our application
RUN npm i -g pm2

# Add application files
ADD . /var/www/app/current

# Expose the port
EXPOSE 4500

CMD ["pm2", "start", "processes.json", "--no-daemon"]
# the --no-daemon is a minor workaround to prevent the docker container from thinking pm2 has stopped running and ending itself
