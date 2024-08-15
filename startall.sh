#!/bin/bash

   # Navigate to the React app folder and start it
   cd ./RealTimeAppClient/pizza-dashboard
   npm start &

   # Navigate to the .NET app folder and start it
   cd ./RealTimeAppServer
   dotnet run