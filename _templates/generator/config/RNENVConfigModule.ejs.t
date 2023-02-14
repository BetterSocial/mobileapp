---
to: android/app/src/main/java/org/bettersocial/RNENVConfigModule.java
force: true
---
package org.bettersocial<%= name %>;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
public class RNENVConfigModule extends ReactContextBaseJavaModule {
RNENVConfigModule(ReactApplicationContext context) {
super(context);
}
@Override
public String getName() {
return "RNENVConfig";
}
@Override
public Map<String, Object> getConstants() {
final Map<String, Object> constants = new HashMap<>();
constants.put("env", BuildConfig.FLAVOR);
return constants;
}
}