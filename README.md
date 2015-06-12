# nofapp
Awesomeness.

## Dev Roadmap
- [x] Switch from LocalStorage to Cordova SQLite
- [x] Chart Backend (Angular-NVD3)
- [x] Global Database Backend (Firebase)
- [ ] WebApp at nofapp.com

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
Install Cordova Plugins based on package.json
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
