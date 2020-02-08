import { reactotronRedux } from 'reactotron-redux';
import { Platform } from "react-native";
import Reactotron, {
  trackGlobalErrors,
  // openInEditor,
  // overlay,
  // asyncStorage,
  // networking
} from 'reactotron-react-native'

const _TAG_NAME = "3LiChat";

Reactotron
  .configure(
    {
      name: _TAG_NAME,
      // host: '10.204.1.226',
      host: '192.168.1.245',
      // host:'Localhost',
      port: 9090,
    }
  )

if (Platform.OS !== "web") {
  Reactotron.use(trackGlobalErrors())
    .use(reactotronRedux())
  // .use(openInEditor())
  // .use(overlay())
  // .use(asyncStorage())
  // .use(networking())
}

if (__DEV__) {
  Reactotron.connect();
}

console.tlog = tlog;
// console.tlog = function (tagName, preview, ...params) {};
// console.log = function (...params) {};

function tlog(tagName, preview, ...params) {
  if (__DEV__) {
    console.log(`[${_TAG_NAME}]:${Platform.OS.toUpperCase()}`, tagName, preview, params);
  } else {
    return;
  }

  if (
    tagName && preview &&
    typeof tagName === "string" &&
    typeof preview === "object"
  ) {
    if (__DEV__) {
      Reactotron.display({
        name: `[${_TAG_NAME}]:${Platform.OS.toUpperCase()}`,
        preview: JSON.stringify(tagName),
        value: tagName
      });
      Reactotron.display({
        name: `[${_TAG_NAME}]:${Platform.OS.toUpperCase()}-` + tagName,
        preview: JSON.stringify(preview),
        value: preview
      });
    } else {
      console.warn("TLOG", tagName);
    }

    return;
  }

  if (
    tagName &&
    typeof tagName !== "string" &&
    typeof tagName !== "undefined"
  ) {
    if (__DEV__) {
      Reactotron.display({
        name: `[${_TAG_NAME}]:${Platform.OS.toUpperCase()}`,
        preview: JSON.stringify(tagName),
        value: tagName
      });
    } else {
      console.warn("TLOG", tagName);
    }

    return;
  }

  let mTagName =
    tagName && typeof tagName !== "undefined"
      ? JSON.stringify(tagName)
      : "TLOG";
  if (__DEV__) {
    let mPreview =
      preview && typeof preview !== "undefined"
        ? JSON.stringify(preview)
        : JSON.stringify(params);

    let mValue = params.length == 1 ? params[0] : params;
    if (params.length === 0) {
      mValue = mPreview;
    }

    Reactotron.display({
      name: `[${_TAG_NAME}]:${Platform.OS.toUpperCase()}-` + mTagName,
      preview: mPreview,
      value: mValue
    });
  } else {
    console.warn(
      mTagName,
      preview && typeof preview !== "undefined" ? preview : "",
      params
    );
  }
}



Reactotron.clear();