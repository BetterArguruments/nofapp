# nofapp
Awesomeness.

## Dev Roadmap
- [ ] Switch from LocalStorage to Cordova SQLite
- [ ] Chart Backend (Chart.js + Scatter?)
- [ ] Global Database Backend (Firebase?) See this as example: https://github.com/mappmechanic/ionic-firebase

## Build
If you haven't installed Cordova and Ionic yet, do it:
```
sudo npm install -g cordova ionic
```
Clone this repo
```
git clone https://github.com/BetterArguruments/nofapp.git
```
Install Node.js and Bower Dependencies
```
npm install
bower install
```
Install Cordova Plugins
```
ionic state restore
```

## Debug
Important! Native plugins like Cordova-SQLite won't work in the browser. Therefore, we should debug in our devices or emulators from now on.

Guess what! You have to re-build it every time, for example with ionic serve:
```
ionic serve -b
```
Run the App (Android)
```
ionic run android
```
Launch a refined adb logcat
```
adb logcat Cordova:D DroidGap:D CordovaLog:D chromium:I *:S
```
