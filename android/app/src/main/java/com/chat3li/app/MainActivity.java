package com.chat3li.app;

import android.os.Bundle;
import android.widget.ImageView;

import com.facebook.react.ReactActivity;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "chat3li";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        /*requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);*/
        //RCTSplashScreen.openSplashScreen(this);   //open splashscreen
        RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.FIT_XY);   //open splashscreen fullscreen
        super.onCreate(savedInstanceState);

    }
}
