echo "Starting"
set HTTPS=true
start /d "frontend" yarn start
start /d "backend" yarn start