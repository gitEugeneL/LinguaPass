FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
    -keyout /app/account-key.pem \
    -out /app/account-cert.pem \
    -subj "/CN=account.service" \
    -addext "subjectAltName=DNS:account.service,DNS:localhost,IP:127.0.0.1"

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Services/Account/Account/Account.csproj", "Services/Account/Account/"]

COPY ["Services/Common/MessageBroker/MessageBroker.csproj", "Services/Common/MessageBroker/"]
COPY ["Services/Common/AuthConfig/AuthConfig.csproj", "Services/Common/AuthConfig/"]
COPY ["Services/Common/GrpcProtos/GrpcProtos.csproj", "Services/Common/GrpcProtos/"]

COPY . .
WORKDIR "/src/Services/Account/Account"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS runtime
WORKDIR /app
COPY --from=publish /app/publish .

RUN rm brokersettings.json  
RUN rm authsettings.json  

ENTRYPOINT ["dotnet", "Account.dll"]

