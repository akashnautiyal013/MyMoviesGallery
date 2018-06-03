// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase:{
  	apiKey: "AIzaSyCfXvQsQJQ9BdeHzoaltyqOEq0Noy9GFWg",
    authDomain: "moviegallery-1344d.firebaseapp.com",
    databaseURL: "https://moviegallery-1344d.firebaseio.com",
    projectId: "moviegallery-1344d",
    storageBucket: "",
    messagingSenderId: "943994620249"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
