FROM postgres:latest

COPY ./init_course.sql /docker-entrypoint-initdb.d/ 
RUN chmod 644 /docker-entrypoint-initdb.d/*.sql