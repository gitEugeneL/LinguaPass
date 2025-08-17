FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
    -keyout /app/course-key.pem \
    -out /app/course-cert.pem \
    -subj "/CN=course.service" \
    -addext "subjectAltName=DNS:course.service,DNS:localhost,IP:127.0.0.1"

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Services/Course/Course/Course.csproj", "Services/Course/Course/"]

COPY ["Services/Common/AuthConfig/AuthConfig.csproj", "Services/Common/AuthConfig/"]
COPY ["Services/Common/GrpcProtos/GrpcProtos.csproj", "Services/Common/GrpcProtos/"]

COPY . .
WORKDIR "/src/Services/Course/Course"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS runtime
WORKDIR /app
COPY --from=publish /app/publish .


RUN rm authsettings.json  

ENTRYPOINT ["dotnet", "Course.dll"]
