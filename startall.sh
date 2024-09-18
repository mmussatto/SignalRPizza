#!/bin/bash

   # Navigate to the React app folder and start it
   cd ./RealTimeAppClient
   npm start &

   # Navigate to the .NET app folder and start it
   cd ./RealTimeAppServer
   dotnet run