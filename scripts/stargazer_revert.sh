
#!/bin/bash

# Rename App_Temp.tsx back to App.tsx to revert Stargazer setup
cp App.tsx StargazerApp.tsx
cp App_Temp.tsx App.tsx
rm App_Temp.tsx