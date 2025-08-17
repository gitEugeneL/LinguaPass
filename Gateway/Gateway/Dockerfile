FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
    -keyout /app/gateway-key.pem \
    -out /app/gateway-cert.pem \
    -subj "/CN=gateway.service" \
    -addext "subjectAltName=DNS:gateway.service,DNS:localhost,IP:127.0.0.1"

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Gateway/Gateway/Gateway.csproj", "Gateway/Gateway/"]
RUN dotnet restore "./Gateway/Gateway/Gateway.csproj"

COPY . .
WORKDIR "/src/Gateway/Gateway"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS runtime
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Gateway.dll"]
