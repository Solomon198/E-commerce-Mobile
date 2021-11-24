package com.dansako;
import android.os.Bundle; // here
import com.facebook.react.ReactActivity;
// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen; // here
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {
@Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);
    }
 
}
    