fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android clean

```sh
[bundle exec] fastlane android clean
```



### android assemble

```sh
[bundle exec] fastlane android assemble
```



### android bundle

```sh
[bundle exec] fastlane android bundle
```



### android bump_version

```sh
[bundle exec] fastlane android bump_version
```

Update build version number android

### android release

```sh
[bundle exec] fastlane android release
```

Build and Release android

### android upload_aab_to_firebase_distribution

```sh
[bundle exec] fastlane android upload_aab_to_firebase_distribution
```

Build and upload to firebase distribution

### android upload_apk_to_firebase_distribution

```sh
[bundle exec] fastlane android upload_apk_to_firebase_distribution
```



### android upload_to_play_store_internal_testing

```sh
[bundle exec] fastlane android upload_to_play_store_internal_testing
```

upload to playstore internal testing

----


## iOS

### ios signing

```sh
[bundle exec] fastlane ios signing
```

Signing cert

### ios register_new_device

```sh
[bundle exec] fastlane ios register_new_device
```

register udid to apple developer

### ios update_cert

```sh
[bundle exec] fastlane ios update_cert
```

update certificate in apple developer and repo ios certificate

### ios bump_version

```sh
[bundle exec] fastlane ios bump_version
```

Update build version number ios

### ios release

```sh
[bundle exec] fastlane ios release
```

release ios

### ios build

```sh
[bundle exec] fastlane ios build
```



### ios upload_ipa_to_firebase_distribution

```sh
[bundle exec] fastlane ios upload_ipa_to_firebase_distribution
```

Build and upload to firebase distribution

### ios upload_testflight

```sh
[bundle exec] fastlane ios upload_testflight
```

Build and upload to Test Flight for Beta Testing.

----


## general

### general release_tag

```sh
[bundle exec] fastlane general release_tag
```

Create git release tag

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
