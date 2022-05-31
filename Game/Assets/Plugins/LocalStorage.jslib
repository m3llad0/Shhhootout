mergeInto(LibraryManager.library, {

  GetLocalStorage: function (key) {
    const item = window.localStorage.getItem(UTF8ToString(key)) ?? ""
    const bufferSize = lengthBytesUTF8(item) + 1;
    const buffer = _malloc(bufferSize);
    stringToUTF8(item, buffer, bufferSize);
    return buffer;
  },

  SetLocalStorage: function (key, value) {
    window.localStorage.setItem(UTF8ToString(key), value)
  }

});