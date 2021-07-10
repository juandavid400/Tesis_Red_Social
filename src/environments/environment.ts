// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

export const environment = {
  production: false,
  firebase: {
      apiKey: "AIzaSyCIR3JiUZvA-GQ6lPjWS3BRRgWc9u8RJZM",
      authDomain: "tesisredsocial-be58f.firebaseapp.com",
      databaseURL: "https://tesisredsocial-be58f-default-rtdb.firebaseio.com",
      projectId: "tesisredsocial-be58f",
      storageBucket: "tesisredsocial-be58f.appspot.com",
      messagingSenderId: "348716640893",
      appId: "1:348716640893:web:9f290665f9500eb053df14",
      measurementId: "G-S0D67JZESZ"
  }
  ,AngularFireAuthGuard
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
