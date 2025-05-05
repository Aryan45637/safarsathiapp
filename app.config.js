import 'dotenv/config';
 
 export default ({ config }) => {
 
   return {
     ...config,
     name: "safarsathiapp",
     slug: "safarsathiapp",
     version: "1.0.0",
     orientation: "portrait",
     icon: "./assets/images/icon.png",
     scheme: "myapp",
     userInterfaceStyle: "automatic",
     newArchEnabled: true,
     ios: {
       supportsTablet: true,
     },
     android: {
       adaptiveIcon: {
         foregroundImage: "./assets/images/adaptive-icon.png",
         backgroundColor: "#ffffff",
       },
       package: "com.anonymous.safarsathiapp",
     },
     web: {
       bundler: "metro",
       output: "static",
       favicon: "./assets/images/favicon.png",
     },
     plugins: [
       "expo-router",
       [
         "expo-splash-screen",
         {
           image: "./assets/images/splash-icon.png",
           imageWidth: 200,
           resizeMode: "contain",
           backgroundColor: "#ffffff",
         },
       ],
     ],
     experiments: {
       typedRoutes: true,
     },
     extra: {
       googleMapKey: process.env.GOOGLE_MAP_KEY,
       BASE_URL: process.env.BASE_URL
     },
   };
 };