echo "Running Node Package Manager Installers"
cd frontend
if npm install ; then
    echo "Frontend Installed"
else
    echo "Frontend installing using Force"
    npm install --force
fi
cd ../backend
if npm install ; then
    echo "Backend Installed"
else
    echo "Backend installing using Force"
    npm install --force
fi
echo "Running Backend and Frontend servers"
node server & cd ../frontend & npm run serve
