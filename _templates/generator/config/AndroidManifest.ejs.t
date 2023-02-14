---
to: android/app/src/main/AndroidManifest.xml
force: true
---
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="org.bettersocial<%= name %>">

    <uses-permission android:name="android.permission.INTERNET" />
     <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
     <uses-permission android:name="android.permission.CAMERA" />
     <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
     <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
      <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:extractNativeLibs="true"
      android:hardwareAccelerated="false"
      android:theme="@style/AppTheme">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:screenOrientation="portrait"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
        android:launchMode="singleTask"
        android:exported="true"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
             <action android:name="OPEN_ACTIVITY_1" />
            <category android:name="android.intent.category.DEFAULT" />
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
        <intent-filter>
          <action android:name="android.intent.action.VIEW" />
          <category android:name="android.intent.category.BROWSABLE" />
          <category android:name="android.intent.category.DEFAULT" />
          <data android:scheme="https"
            android:host="link.bettersocial.org"
            android:pathPrefix="/"/>
        </intent-filter>
        <intent-filter>
          <action android:name="android.intent.action.VIEW" />
          <category android:name="android.intent.category.BROWSABLE" />
          <category android:name="android.intent.category.DEFAULT" />
          <data android:scheme="http"
            android:host="13.114.138.142"
            android:pathPrefix="/"/>
        </intent-filter>

      </activity>
<!--      <activity-->
<!--      android:exported="true"-->
<!--      android:name="com.facebook.react.devsupport.DevSettingsActivity" />-->
    </application>

</manifest>
