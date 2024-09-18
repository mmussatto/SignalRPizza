# Define the paths to your projects
$reactAppPath = "./RealTimeAppClient"
$dotnetAppPath = "./RealTimeAppServer"

# Start the React app in a new terminal window
Start-Process powershell -ArgumentList "cd $reactAppPath; npm start"

# Start the .NET app in a new terminal window
Start-Process powershell -ArgumentList "cd $dotnetAppPath; dotnet run"