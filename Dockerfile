FROM postgres:15-alpine

# Variables de entorno por defecto
ENV POSTGRES_DB=tasks_db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Crear el esquema tasks
COPY ./docker/init.sql /docker-entrypoint-initdb.d/

# Exponer el puerto estándar de PostgreSQL
EXPOSE 5432

# Configuraciones adicionales para desarrollo
# Estas configuraciones se aplicarán al iniciar el contenedor
RUN echo "max_connections = 100" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "shared_buffers = 128MB" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "effective_cache_size = 256MB" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "log_destination = 'stderr'" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "logging_collector = on" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "log_directory = '/var/log/postgresql'" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "log_statement = 'all'" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "log_min_duration_statement = 0" >> /usr/local/share/postgresql/postgresql.conf.sample

# Crear directorio para logs
RUN mkdir -p /var/log/postgresql && \
    chown postgres:postgres /var/log/postgresql

CMD ["postgres"]
