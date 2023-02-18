package org.bettersocial;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.view.KeyEvent;
import android.os.Bundle;
import com.github.kevinejohn.keyevent.KeyEventModule; 
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      setTheme(R.style.AppTheme); // Now set the theme from Splash to App before setContentView
      setContentView(R.layout.launch_screen); // Then inflate the new view
      SplashScreen.show(this);
      super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BetterSocial";
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent event) {
    int keyEvent = event.getAction();
    if(keyEvent == KeyEvent.ACTION_UP){
      KeyEventModule.getInstance().onKeyUpEvent(event.getKeyCode(), event);
    }
    return super.dispatchKeyEvent(event);
  }

  @Override 
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    KeyEventModule.getInstance().onKeyUpEvent(keyCode, event);
      // There are 2 ways this can be done:
      //  1.  Override the default keyboard event behavior
      //    super.onKeyUp(keyCode, event);
      //    return true;

      //  2.  Keep default keyboard event behavior
      //    return super.onKeyUp(keyCode, event);

      // Using method #1
      super.onKeyUp(keyCode, event);
      return true;
    }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
