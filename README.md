# mobileapp
Helio Mobile App

# Checkout the source

```
   git clone https://github.com/BetterSocial/mobileapp.git
   yarn
```

# Development Requirements

Some files are ignored in GIT
You will need to ask these files and put in your directory before build

- **debug.keystore** - you will need this one to be put in the android/app/debug.keystore
- **keystore.properties** - this file will be needed
- **google-services.json** - this file will be used to interact with Firebase Services, for example Remote Config, etc.

# Run in emulator

```
   yarn android
```

# Build APK

```
   yarn build:android
```

