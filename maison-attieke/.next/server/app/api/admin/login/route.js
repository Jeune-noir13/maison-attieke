"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/login/route";
exports.ids = ["app/api/admin/login/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Flogin%2Froute&page=%2Fapi%2Fadmin%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Flogin%2Froute&page=%2Fapi%2Fadmin%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_user_Downloads_maison_attieke_app_api_admin_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/login/route.ts */ \"(rsc)/./app/api/admin/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/login/route\",\n        pathname: \"/api/admin/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/login/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\user\\\\Downloads\\\\maison-attieke\\\\app\\\\api\\\\admin\\\\login\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_user_Downloads_maison_attieke_app_api_admin_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/admin/login/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmxvZ2luJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhZG1pbiUyRmxvZ2luJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWRtaW4lMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUN1c2VyJTVDRG93bmxvYWRzJTVDbWFpc29uLWF0dGlla2UlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3VzZXIlNUNEb3dubG9hZHMlNUNtYWlzb24tYXR0aWVrZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDNEI7QUFDekc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYWlzb24tYXR0aWVrZS8/Mjc4MCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERvd25sb2Fkc1xcXFxtYWlzb24tYXR0aWVrZVxcXFxhcHBcXFxcYXBpXFxcXGFkbWluXFxcXGxvZ2luXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hZG1pbi9sb2dpbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2FkbWluL2xvZ2luXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hZG1pbi9sb2dpbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHVzZXJcXFxcRG93bmxvYWRzXFxcXG1haXNvbi1hdHRpZWtlXFxcXGFwcFxcXFxhcGlcXFxcYWRtaW5cXFxcbG9naW5cXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2FkbWluL2xvZ2luL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Flogin%2Froute&page=%2Fapi%2Fadmin%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/admin/login/route.ts":
/*!**************************************!*\
  !*** ./app/api/admin/login/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_admin_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/admin-auth */ \"(rsc)/./lib/admin-auth.ts\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\n\n\nasync function POST(req) {\n    const { email, motDePasse } = await req.json();\n    if (!email || !motDePasse) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Champs requis\"\n    }, {\n        status: 400\n    });\n    const admin = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.admin.findUnique({\n        where: {\n            email\n        }\n    });\n    if (!admin) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Identifiants incorrects\"\n    }, {\n        status: 401\n    });\n    const valid = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(motDePasse, admin.motDePasse);\n    if (!valid) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Identifiants incorrects\"\n    }, {\n        status: 401\n    });\n    const token = await (0,_lib_admin_auth__WEBPACK_IMPORTED_MODULE_3__.signToken)({\n        id: admin.id,\n        email: admin.email,\n        nom: admin.nom,\n        role: \"ADMIN\"\n    });\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_4__.cookies)().set(\"admin_token\", token, {\n        httpOnly: true,\n        secure: \"development\" === \"production\",\n        sameSite: \"lax\",\n        maxAge: 60 * 60 * 12,\n        path: \"/\"\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2xvZ2luL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBdUQ7QUFDMUI7QUFDUTtBQUNPO0FBQ047QUFFL0IsZUFBZUssS0FBS0MsR0FBZ0I7SUFDekMsTUFBTSxFQUFFQyxLQUFLLEVBQUVDLFVBQVUsRUFBRSxHQUFHLE1BQU1GLElBQUlHLElBQUk7SUFDNUMsSUFBSSxDQUFDRixTQUFTLENBQUNDLFlBQVksT0FBT1IscURBQVlBLENBQUNTLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQWdCLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBRTlGLE1BQU1DLFFBQVEsTUFBTVYsK0NBQU1BLENBQUNVLEtBQUssQ0FBQ0MsVUFBVSxDQUFDO1FBQUVDLE9BQU87WUFBRVA7UUFBTTtJQUFFO0lBQy9ELElBQUksQ0FBQ0ssT0FBTyxPQUFPWixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBMEIsR0FBRztRQUFFQyxRQUFRO0lBQUk7SUFFekYsTUFBTUksUUFBUSxNQUFNZCx1REFBYyxDQUFDTyxZQUFZSSxNQUFNSixVQUFVO0lBQy9ELElBQUksQ0FBQ08sT0FBTyxPQUFPZixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBMEIsR0FBRztRQUFFQyxRQUFRO0lBQUk7SUFFekYsTUFBTU0sUUFBUSxNQUFNZCwwREFBU0EsQ0FBQztRQUFFZSxJQUFJTixNQUFNTSxFQUFFO1FBQUVYLE9BQU9LLE1BQU1MLEtBQUs7UUFBRVksS0FBS1AsTUFBTU8sR0FBRztRQUFFQyxNQUFNO0lBQVE7SUFFaEdoQixxREFBT0EsR0FBR2lCLEdBQUcsQ0FBQyxlQUFlSixPQUFPO1FBQ2xDSyxVQUFVO1FBQ1ZDLFFBQVFDLGtCQUF5QjtRQUNqQ0MsVUFBVTtRQUNWQyxRQUFRLEtBQUssS0FBSztRQUNsQkMsTUFBTTtJQUNSO0lBRUEsT0FBTzNCLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7UUFBRW1CLFNBQVM7SUFBSztBQUMzQyIsInNvdXJjZXMiOlsid2VicGFjazovL21haXNvbi1hdHRpZWtlLy4vYXBwL2FwaS9hZG1pbi9sb2dpbi9yb3V0ZS50cz9mNDRhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnXG5pbXBvcnQgeyBzaWduVG9rZW4gfSBmcm9tICdAL2xpYi9hZG1pbi1hdXRoJ1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycydcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCB7IGVtYWlsLCBtb3REZVBhc3NlIH0gPSBhd2FpdCByZXEuanNvbigpXG4gIGlmICghZW1haWwgfHwgIW1vdERlUGFzc2UpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnQ2hhbXBzIHJlcXVpcycgfSwgeyBzdGF0dXM6IDQwMCB9KVxuXG4gIGNvbnN0IGFkbWluID0gYXdhaXQgcHJpc21hLmFkbWluLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBlbWFpbCB9IH0pXG4gIGlmICghYWRtaW4pIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSWRlbnRpZmlhbnRzIGluY29ycmVjdHMnIH0sIHsgc3RhdHVzOiA0MDEgfSlcblxuICBjb25zdCB2YWxpZCA9IGF3YWl0IGJjcnlwdC5jb21wYXJlKG1vdERlUGFzc2UsIGFkbWluLm1vdERlUGFzc2UpXG4gIGlmICghdmFsaWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSWRlbnRpZmlhbnRzIGluY29ycmVjdHMnIH0sIHsgc3RhdHVzOiA0MDEgfSlcblxuICBjb25zdCB0b2tlbiA9IGF3YWl0IHNpZ25Ub2tlbih7IGlkOiBhZG1pbi5pZCwgZW1haWw6IGFkbWluLmVtYWlsLCBub206IGFkbWluLm5vbSwgcm9sZTogJ0FETUlOJyB9KVxuXG4gIGNvb2tpZXMoKS5zZXQoJ2FkbWluX3Rva2VuJywgdG9rZW4sIHtcbiAgICBodHRwT25seTogdHJ1ZSxcbiAgICBzZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXG4gICAgc2FtZVNpdGU6ICdsYXgnLFxuICAgIG1heEFnZTogNjAgKiA2MCAqIDEyLCAvLyAxMmhcbiAgICBwYXRoOiAnLycsXG4gIH0pXG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogdHJ1ZSB9KVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImJjcnlwdCIsInByaXNtYSIsInNpZ25Ub2tlbiIsImNvb2tpZXMiLCJQT1NUIiwicmVxIiwiZW1haWwiLCJtb3REZVBhc3NlIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiYWRtaW4iLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJ2YWxpZCIsImNvbXBhcmUiLCJ0b2tlbiIsImlkIiwibm9tIiwicm9sZSIsInNldCIsImh0dHBPbmx5Iiwic2VjdXJlIiwicHJvY2VzcyIsInNhbWVTaXRlIiwibWF4QWdlIiwicGF0aCIsInN1Y2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/admin-auth.ts":
/*!***************************!*\
  !*** ./lib/admin-auth.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getAdminFromCookie: () => (/* binding */ getAdminFromCookie),\n/* harmony export */   getLivreurFromCookie: () => (/* binding */ getLivreurFromCookie),\n/* harmony export */   requireAdmin: () => (/* binding */ requireAdmin),\n/* harmony export */   requireLivreur: () => (/* binding */ requireLivreur),\n/* harmony export */   signToken: () => (/* binding */ signToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/sign.js\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/verify.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\nconst secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || \"maison-attieke-secret-key-2024\");\nasync function signToken(payload, expiresIn = \"12h\") {\n    return new jose__WEBPACK_IMPORTED_MODULE_1__.SignJWT(payload).setProtectedHeader({\n        alg: \"HS256\"\n    }).setExpirationTime(expiresIn).setIssuedAt().sign(secret);\n}\nasync function verifyToken(token) {\n    try {\n        const { payload } = await (0,jose__WEBPACK_IMPORTED_MODULE_2__.jwtVerify)(token, secret);\n        return payload;\n    } catch  {\n        return null;\n    }\n}\nasync function getAdminFromCookie() {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)().get(\"admin_token\")?.value;\n    if (!token) return null;\n    const payload = await verifyToken(token);\n    if (!payload || payload.role !== \"ADMIN\") return null;\n    return payload;\n}\nasync function getLivreurFromCookie() {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)().get(\"livreur_token\")?.value;\n    if (!token) return null;\n    const payload = await verifyToken(token);\n    if (!payload || payload.role !== \"LIVREUR\") return null;\n    return payload;\n}\nasync function requireAdmin(req) {\n    const token = req.cookies.get(\"admin_token\")?.value;\n    if (!token) return null;\n    const payload = await verifyToken(token);\n    if (!payload || payload.role !== \"ADMIN\") return null;\n    return payload;\n}\nasync function requireLivreur(req) {\n    const token = req.cookies.get(\"livreur_token\")?.value;\n    if (!token) return null;\n    const payload = await verifyToken(token);\n    if (!payload || payload.role !== \"LIVREUR\") return null;\n    return payload;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYWRtaW4tYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBeUM7QUFDSDtBQUd0QyxNQUFNRyxTQUFTLElBQUlDLGNBQWNDLE1BQU0sQ0FDckNDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZSxJQUFJO0FBRzFCLGVBQWVDLFVBQVVDLE9BQWdDLEVBQUVDLFlBQVksS0FBSztJQUNqRixPQUFPLElBQUlYLHlDQUFPQSxDQUFDVSxTQUNoQkUsa0JBQWtCLENBQUM7UUFBRUMsS0FBSztJQUFRLEdBQ2xDQyxpQkFBaUIsQ0FBQ0gsV0FDbEJJLFdBQVcsR0FDWEMsSUFBSSxDQUFDYjtBQUNWO0FBRU8sZUFBZWMsWUFBWUMsS0FBYTtJQUM3QyxJQUFJO1FBQ0YsTUFBTSxFQUFFUixPQUFPLEVBQUUsR0FBRyxNQUFNVCwrQ0FBU0EsQ0FBQ2lCLE9BQU9mO1FBQzNDLE9BQU9PO0lBQ1QsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0Y7QUFFTyxlQUFlUztJQUNwQixNQUFNRCxRQUFRaEIscURBQU9BLEdBQUdrQixHQUFHLENBQUMsZ0JBQWdCQztJQUM1QyxJQUFJLENBQUNILE9BQU8sT0FBTztJQUNuQixNQUFNUixVQUFVLE1BQU1PLFlBQVlDO0lBQ2xDLElBQUksQ0FBQ1IsV0FBV0EsUUFBUVksSUFBSSxLQUFLLFNBQVMsT0FBTztJQUNqRCxPQUFPWjtBQUNUO0FBRU8sZUFBZWE7SUFDcEIsTUFBTUwsUUFBUWhCLHFEQUFPQSxHQUFHa0IsR0FBRyxDQUFDLGtCQUFrQkM7SUFDOUMsSUFBSSxDQUFDSCxPQUFPLE9BQU87SUFDbkIsTUFBTVIsVUFBVSxNQUFNTyxZQUFZQztJQUNsQyxJQUFJLENBQUNSLFdBQVdBLFFBQVFZLElBQUksS0FBSyxXQUFXLE9BQU87SUFDbkQsT0FBT1o7QUFDVDtBQUVPLGVBQWVjLGFBQWFDLEdBQWdCO0lBQ2pELE1BQU1QLFFBQVFPLElBQUl2QixPQUFPLENBQUNrQixHQUFHLENBQUMsZ0JBQWdCQztJQUM5QyxJQUFJLENBQUNILE9BQU8sT0FBTztJQUNuQixNQUFNUixVQUFVLE1BQU1PLFlBQVlDO0lBQ2xDLElBQUksQ0FBQ1IsV0FBV0EsUUFBUVksSUFBSSxLQUFLLFNBQVMsT0FBTztJQUNqRCxPQUFPWjtBQUNUO0FBRU8sZUFBZWdCLGVBQWVELEdBQWdCO0lBQ25ELE1BQU1QLFFBQVFPLElBQUl2QixPQUFPLENBQUNrQixHQUFHLENBQUMsa0JBQWtCQztJQUNoRCxJQUFJLENBQUNILE9BQU8sT0FBTztJQUNuQixNQUFNUixVQUFVLE1BQU1PLFlBQVlDO0lBQ2xDLElBQUksQ0FBQ1IsV0FBV0EsUUFBUVksSUFBSSxLQUFLLFdBQVcsT0FBTztJQUNuRCxPQUFPWjtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFpc29uLWF0dGlla2UvLi9saWIvYWRtaW4tYXV0aC50cz8wNzE2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNpZ25KV1QsIGp3dFZlcmlmeSB9IGZyb20gJ2pvc2UnXG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJ1xuaW1wb3J0IHsgTmV4dFJlcXVlc3QgfSBmcm9tICduZXh0L3NlcnZlcidcblxuY29uc3Qgc2VjcmV0ID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKFxuICBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQgfHwgJ21haXNvbi1hdHRpZWtlLXNlY3JldC1rZXktMjAyNCdcbilcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNpZ25Ub2tlbihwYXlsb2FkOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgZXhwaXJlc0luID0gJzEyaCcpIHtcbiAgcmV0dXJuIG5ldyBTaWduSldUKHBheWxvYWQpXG4gICAgLnNldFByb3RlY3RlZEhlYWRlcih7IGFsZzogJ0hTMjU2JyB9KVxuICAgIC5zZXRFeHBpcmF0aW9uVGltZShleHBpcmVzSW4pXG4gICAgLnNldElzc3VlZEF0KClcbiAgICAuc2lnbihzZWNyZXQpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlUb2tlbih0b2tlbjogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhd2FpdCBqd3RWZXJpZnkodG9rZW4sIHNlY3JldClcbiAgICByZXR1cm4gcGF5bG9hZFxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBZG1pbkZyb21Db29raWUoKSB7XG4gIGNvbnN0IHRva2VuID0gY29va2llcygpLmdldCgnYWRtaW5fdG9rZW4nKT8udmFsdWVcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGxcbiAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHZlcmlmeVRva2VuKHRva2VuKVxuICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC5yb2xlICE9PSAnQURNSU4nKSByZXR1cm4gbnVsbFxuICByZXR1cm4gcGF5bG9hZFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TGl2cmV1ckZyb21Db29raWUoKSB7XG4gIGNvbnN0IHRva2VuID0gY29va2llcygpLmdldCgnbGl2cmV1cl90b2tlbicpPy52YWx1ZVxuICBpZiAoIXRva2VuKSByZXR1cm4gbnVsbFxuICBjb25zdCBwYXlsb2FkID0gYXdhaXQgdmVyaWZ5VG9rZW4odG9rZW4pXG4gIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnJvbGUgIT09ICdMSVZSRVVSJykgcmV0dXJuIG51bGxcbiAgcmV0dXJuIHBheWxvYWRcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBZG1pbihyZXE6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IHRva2VuID0gcmVxLmNvb2tpZXMuZ2V0KCdhZG1pbl90b2tlbicpPy52YWx1ZVxuICBpZiAoIXRva2VuKSByZXR1cm4gbnVsbFxuICBjb25zdCBwYXlsb2FkID0gYXdhaXQgdmVyaWZ5VG9rZW4odG9rZW4pXG4gIGlmICghcGF5bG9hZCB8fCBwYXlsb2FkLnJvbGUgIT09ICdBRE1JTicpIHJldHVybiBudWxsXG4gIHJldHVybiBwYXlsb2FkXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1aXJlTGl2cmV1cihyZXE6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IHRva2VuID0gcmVxLmNvb2tpZXMuZ2V0KCdsaXZyZXVyX3Rva2VuJyk/LnZhbHVlXG4gIGlmICghdG9rZW4pIHJldHVybiBudWxsXG4gIGNvbnN0IHBheWxvYWQgPSBhd2FpdCB2ZXJpZnlUb2tlbih0b2tlbilcbiAgaWYgKCFwYXlsb2FkIHx8IHBheWxvYWQucm9sZSAhPT0gJ0xJVlJFVVInKSByZXR1cm4gbnVsbFxuICByZXR1cm4gcGF5bG9hZFxufVxuIl0sIm5hbWVzIjpbIlNpZ25KV1QiLCJqd3RWZXJpZnkiLCJjb29raWVzIiwic2VjcmV0IiwiVGV4dEVuY29kZXIiLCJlbmNvZGUiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIiwic2lnblRva2VuIiwicGF5bG9hZCIsImV4cGlyZXNJbiIsInNldFByb3RlY3RlZEhlYWRlciIsImFsZyIsInNldEV4cGlyYXRpb25UaW1lIiwic2V0SXNzdWVkQXQiLCJzaWduIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsImdldEFkbWluRnJvbUNvb2tpZSIsImdldCIsInZhbHVlIiwicm9sZSIsImdldExpdnJldXJGcm9tQ29va2llIiwicmVxdWlyZUFkbWluIiwicmVxIiwicmVxdWlyZUxpdnJldXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/admin-auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFFO0FBRWxFLElBQUlJLElBQXlCLEVBQWNILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL21haXNvbi1hdHRpZWtlLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB9XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/jose","vendor-chunks/bcryptjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Flogin%2Froute&page=%2Fapi%2Fadmin%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cuser%5CDownloads%5Cmaison-attieke&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();