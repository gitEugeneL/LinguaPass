FROM postgres:17

COPY ./init_course.sql /docker-entrypoint-initdb.d/ 
RUN chmod 644 /docker-entrypoint-initdb.d/*.sql