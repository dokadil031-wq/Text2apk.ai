import { AppSpecification, GeneratedFile, PlanType } from '../types';

const TEMPLATES = {
  // --- Android Manifest ---
  'manifest': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.text2apk">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.App">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity android:name=".LoginActivity" />
        <activity android:name=".DashboardActivity" />
        <activity android:name=".NotesActivity" />
        
        <service
            android:name=".services.MyFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
    </application>

</manifest>`,

  // --- Gradle Build Files ---
  'settings_gradle': `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "Text2APK_App"
include(":app")`,

  'project_build_gradle': `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.1.0" apply false
    id("org.jetbrains.kotlin.android") version "1.8.10" apply false
    id("com.google.gms.google-services") version "4.3.15" apply false
}`,

  'app_build_gradle': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.text2apk"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.text2apk"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.10.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // Firebase
    implementation(platform("com.google.firebase:firebase-bom:32.3.1"))
    implementation("com.google.firebase:firebase-analytics-ktx")
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-messaging-ktx")
    
    // Room
    val roomVersion = "2.6.0"
    implementation("androidx.room:room-runtime:$roomVersion")
    annotationProcessor("androidx.room:room-compiler:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
}`,

  // --- Kotlin Activities ---
  'login.kt': `package com.text2apk

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.text2apk.databinding.ActivityLoginBinding
import com.google.firebase.auth.FirebaseAuth

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        auth = FirebaseAuth.getInstance()
        
        binding.loginButton.setOnClickListener {
            val email = binding.emailInput.text.toString()
            val password = binding.passwordInput.text.toString()
            // Perform login logic
        }
    }
}`,

  'dashboard.kt': `package com.text2apk

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class DashboardActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)
        
        // WATERMARK_INJECTION_POINT

        // Initialize dashboard components
        setupNavigation()
    }
    
    private fun setupNavigation() {
        // Bottom navigation setup
    }
}`,

  'notes.kt': `package com.text2apk

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.text2apk.databinding.ActivityNotesBinding

class NotesActivity : AppCompatActivity() {
    private lateinit var binding: ActivityNotesBinding
    private val notesAdapter = NotesAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNotesBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        binding.notesRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@NotesActivity)
            adapter = notesAdapter
        }
    }
}`,

  'offline-db.kt': `package com.text2apk.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.text2apk.data.model.Note

@Database(entities = [Note::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun noteDao(): NoteDao
    
    companion object {
        const val DATABASE_NAME = "app-offline-db"
    }
}`,

  'push.kt': `package com.text2apk.services

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "Refreshed token: $token")
        // Send token to backend
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        // Handle foreground notification
    }
}`,

  'theme-dark.xml': `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.App" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <!-- Dark Theme Colors -->
        <item name="colorPrimary">@color/emerald_200</item>
        <item name="colorPrimaryVariant">@color/emerald_700</item>
        <item name="colorOnPrimary">@color/black</item>
        
        <item name="android:statusBarColor">?attr/colorPrimaryVariant</item>
        <item name="android:windowBackground">@color/slate_900</item>
    </style>
</resources>`
};

export const generateAndroidProject = (spec: AppSpecification, plan: PlanType = PlanType.FREE): GeneratedFile[] => {
  const files: GeneratedFile[] = [];
  const isFree = plan === PlanType.FREE;

  // 1. Root Project Files
  files.push({ fileName: 'settings.gradle.kts', content: TEMPLATES['settings_gradle'], language: 'gradle' });
  files.push({ fileName: 'build.gradle.kts', content: TEMPLATES['project_build_gradle'], language: 'gradle' });
  
  // 2. App Module Config
  files.push({ fileName: 'app/build.gradle.kts', content: TEMPLATES['app_build_gradle'], language: 'gradle' });
  files.push({ fileName: 'app/src/main/AndroidManifest.xml', content: TEMPLATES['manifest'], language: 'xml' });

  // 3. Kotlin Source Files (com.text2apk)
  const basePath = 'app/src/main/java/com/text2apk';

  // Inject Watermark if Free Plan
  let mainActivityContent = TEMPLATES['dashboard.kt'].replace('DashboardActivity', 'MainActivity');
  if (isFree) {
    mainActivityContent = mainActivityContent.replace(
      '// WATERMARK_INJECTION_POINT', 
      'Toast.makeText(this, "Created with Text2APK (Free Version)", Toast.LENGTH_LONG).show()'
    );
  } else {
     mainActivityContent = mainActivityContent.replace('// WATERMARK_INJECTION_POINT', '');
  }

  files.push({ 
    fileName: `${basePath}/MainActivity.kt`, 
    content: mainActivityContent, 
    language: 'kotlin' 
  });

  const screens = spec.screens.map(s => s.toLowerCase());
  
  if (screens.some(s => s.includes('login') || s.includes('auth'))) {
    files.push({ fileName: `${basePath}/LoginActivity.kt`, content: TEMPLATES['login.kt'], language: 'kotlin' });
  }
  
  if (screens.some(s => s.includes('dashboard') || s.includes('home'))) {
    files.push({ fileName: `${basePath}/DashboardActivity.kt`, content: TEMPLATES['dashboard.kt'], language: 'kotlin' });
  }
  
  if (screens.some(s => s.includes('note') || s.includes('list'))) {
    files.push({ fileName: `${basePath}/NotesActivity.kt`, content: TEMPLATES['notes.kt'], language: 'kotlin' });
  }

  // 4. Features
  const features = spec.features.map(f => f.toLowerCase());
  
  // Offline support check - Only for Pro/Agency
  const supportsOffline = (spec.offline || features.some(f => f.includes('offline') || f.includes('database'))) && !isFree;
  
  if (supportsOffline) {
    files.push({ fileName: `${basePath}/data/local/AppDatabase.kt`, content: TEMPLATES['offline-db.kt'], language: 'kotlin' });
  }
  
  if (features.some(f => f.includes('push') || f.includes('notification'))) {
    files.push({ fileName: `${basePath}/services/MyFirebaseMessagingService.kt`, content: TEMPLATES['push.kt'], language: 'kotlin' });
  }

  // 5. Resources
  const resPath = 'app/src/main/res/values';
  // Dark Mode - Only for Pro/Agency
  if (spec.theme.toLowerCase().includes('dark') && !isFree) {
    files.push({ fileName: `${resPath}/themes.xml`, content: TEMPLATES['theme-dark.xml'], language: 'xml' });
  } else {
     // Default Light Theme (also used if Free plan attempts Dark Mode)
     files.push({ 
       fileName: `${resPath}/themes.xml`, 
       content: `<resources>\n    <style name="Theme.App" parent="Theme.MaterialComponents.DayNight.NoActionBar">\n        <item name="colorPrimary">@color/emerald_500</item>\n    </style>\n</resources>`, 
       language: 'xml' 
     });
  }
  
  // Specification file
  files.push({
    fileName: 'blueprint.json',
    content: JSON.stringify(spec, null, 2),
    language: 'json'
  });

  return files;
};
