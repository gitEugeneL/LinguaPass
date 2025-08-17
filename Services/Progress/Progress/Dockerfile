FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
    -keyout /app/progress-key.pem \
    -out /app/progress-cert.pem \
    -subj "/CN=progress.service" \
    -addext "subjectAltName=DNS:progress.service,DNS:localhost,IP:127.0.0.1"

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Services/Progress/Progress/Progress.csproj", "Services/Progress/Progress/"]

COPY ["Services/Common/MessageBroker/MessageBroker.csproj", "Services/Common/MessageBroker/"]
COPY ["Services/Common/AuthConfig/AuthConfig.csproj", "Services/Common/AuthConfig/"]
COPY ["Services/Common/GrpcProtos/GrpcProtos.csproj", "Services/Common/GrpcProtos/"]
COPY ["Services/Shared/Shared.csproj", "Services/Shared/"]  

COPY . .
WORKDIR "/src/Services/Progress/Progress"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS runtime
WORKDIR /app
COPY --from=publish /app/publish .

RUN rm brokersettings.json  
RUN rm authsettings.json  

ENTRYPOINT ["dotnet", "Progress.dll"]
