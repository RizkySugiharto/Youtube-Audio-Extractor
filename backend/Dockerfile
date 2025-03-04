FROM node:22

WORKDIR /backend

COPY . /backend

RUN npm install

EXPOSE 8080

ENV NODE_ENV="development"
ENV API_VERSION=1
ENV API_ADMIN_KEY=admin-key
ENV PORT=3000
ENV ALLOWED_ORIGINS="http://localhost:5500 http://127.0.0.1:5500 http://localhost:8080 http://127.0.0.1:8080"
ENV ALLOWED_REQUEST_PER_MINUTE=10

CMD [ "npm", "start" ]